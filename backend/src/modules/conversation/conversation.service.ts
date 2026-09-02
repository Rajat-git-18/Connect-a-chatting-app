import { AppError } from "../../errors/AppError.js";
import { findUserById } from "../auth/auth.repository.js";
import { connectionRepository } from "../connection/connection.repository.js";
import { conversationRepository } from "./conversation.repository.js";
import type {
  ConversationListItem,
  CreateConversationBody,
  MessageItem,
  PaginatedMessages,
  SendMessageBody,
} from "./conversation.types.js";
import { DEFAULT_MESSAGE_PAGE_SIZE } from "./conversation.constants.js";
import {
  emitConversationRead,
  emitConversationUpdated,
  emitMessageNew,
} from "../../socket/socket.emitter.js";

function getOtherParticipant<T extends { id: string }>(
  conversation: { userOneId: string; userTwoId: string; userOne: T; userTwo: T },
  currentUserId: string
): T {
  return conversation.userOneId === currentUserId
    ? conversation.userTwo
    : conversation.userOne;
}

function mapMessage(message: {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  readAt: Date | null;
  sender: MessageItem["sender"];
}): MessageItem {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    content: message.content,
    createdAt: message.createdAt,
    readAt: message.readAt,
    sender: message.sender,
  };
}

async function assertUsersConnected(userAId: string, userBId: string) {
  const connection = await connectionRepository.findConnectionBetween(
    userAId,
    userBId
  );

  if (!connection) {
    throw new AppError(
      403,
      "You can only message users you are connected with."
    );
  }
}

async function getConversationForParticipant(
  conversationId: string,
  userId: string
) {
  const conversation = await conversationRepository.findById(conversationId);

  if (!conversation) {
    throw new AppError(404, "Conversation not found.");
  }

  if (conversation.userOneId !== userId && conversation.userTwoId !== userId) {
    throw new AppError(403, "You are not part of this conversation.");
  }

  return conversation;
}

export async function listConversationsService(userId: string) {
  const conversations = await conversationRepository.findForUser(userId);

  const data: ConversationListItem[] = await Promise.all(
    conversations.map(async (conversation) => {
      const last = conversation.messages[0];
      const unreadCount = await conversationRepository.countUnread(
        conversation.id,
        userId
      );

      return {
        id: conversation.id,
        otherUser: getOtherParticipant(conversation, userId),
        lastMessage: last
          ? {
              id: last.id,
              content: last.content,
              senderId: last.senderId,
              createdAt: last.createdAt,
              readAt: last.readAt,
            }
          : null,
        unreadCount,
        updatedAt: conversation.updatedAt,
      };
    })
  );

  return {
    success: true,
    message: "Conversations fetched successfully.",
    data,
  };
}

export async function createOrGetConversationService(
  userId: string,
  body: CreateConversationBody
) {
  const { otherUserId } = body;

  if (userId === otherUserId) {
    throw new AppError(400, "You cannot start a conversation with yourself.");
  }

  const otherUser = await findUserById(otherUserId);

  if (!otherUser) {
    throw new AppError(404, "User not found.");
  }

  await assertUsersConnected(userId, otherUserId);

  const existing = await conversationRepository.findBetweenUsers(
    userId,
    otherUserId
  );

  const conversation =
    existing ?? (await conversationRepository.create(userId, otherUserId));

  const unreadCount = await conversationRepository.countUnread(
    conversation.id,
    userId
  );

  const last = await conversationRepository.findMessagesPage(
    conversation.id,
    undefined,
    1
  );

  return {
    success: true,
    message: existing
      ? "Conversation fetched successfully."
      : "Conversation created successfully.",
    data: {
      id: conversation.id,
      otherUser: getOtherParticipant(conversation, userId),
      lastMessage: last[0]
        ? {
            id: last[0].id,
            content: last[0].content,
            senderId: last[0].senderId,
            createdAt: last[0].createdAt,
            readAt: last[0].readAt,
          }
        : null,
      unreadCount,
      updatedAt: conversation.updatedAt,
    },
  };
}

export async function getConversationService(
  userId: string,
  conversationId: string
) {
  const conversation = await getConversationForParticipant(
    conversationId,
    userId
  );

  const unreadCount = await conversationRepository.countUnread(
    conversationId,
    userId
  );

  const last = await conversationRepository.findMessagesPage(
    conversationId,
    undefined,
    1
  );

  return {
    success: true,
    message: "Conversation fetched successfully.",
    data: {
      id: conversation.id,
      otherUser: getOtherParticipant(conversation, userId),
      lastMessage: last[0]
        ? {
            id: last[0].id,
            content: last[0].content,
            senderId: last[0].senderId,
            createdAt: last[0].createdAt,
            readAt: last[0].readAt,
          }
        : null,
      unreadCount,
      updatedAt: conversation.updatedAt,
    },
  };
}

export async function listMessagesService(
  userId: string,
  conversationId: string,
  cursor?: string,
  limit = DEFAULT_MESSAGE_PAGE_SIZE
): Promise<{
  success: boolean;
  message: string;
  data: PaginatedMessages;
}> {
  await getConversationForParticipant(conversationId, userId);

  const messages = await conversationRepository.findMessagesPage(
    conversationId,
    cursor,
    limit
  );

  const nextCursor =
    messages.length === limit ? messages[messages.length - 1]?.id ?? null : null;

  return {
    success: true,
    message: "Messages fetched successfully.",
    data: {
      messages: messages.map(mapMessage),
      nextCursor,
    },
  };
}

export async function sendMessageService(
  userId: string,
  conversationId: string,
  body: SendMessageBody
) {
  const conversation = await getConversationForParticipant(
    conversationId,
    userId
  );

  const otherUserId =
    conversation.userOneId === userId
      ? conversation.userTwoId
      : conversation.userOneId;

  await assertUsersConnected(userId, otherUserId);

  const message = await conversationRepository.createMessage({
    conversationId,
    senderId: userId,
    content: body.content.trim(),
  });

  const mapped = mapMessage(message);
  const lastMessage = {
    id: mapped.id,
    content: mapped.content,
    senderId: mapped.senderId,
    createdAt: mapped.createdAt.toISOString(),
    readAt: mapped.readAt?.toISOString() ?? null,
  };
  const updatedAt = mapped.createdAt.toISOString();

  const inboxUpdate = {
    conversationId,
    lastMessage,
    updatedAt,
    senderId: mapped.senderId,
  };

  emitMessageNew(conversation.userOneId, mapped);
  emitMessageNew(conversation.userTwoId, mapped);
  emitConversationUpdated(conversation.userOneId, inboxUpdate);
  emitConversationUpdated(conversation.userTwoId, inboxUpdate);

  return {
    success: true,
    message: "Message sent successfully.",
    data: mapped,
  };
}

export async function markConversationReadService(
  userId: string,
  conversationId: string
) {
  const conversation = await getConversationForParticipant(
    conversationId,
    userId
  );

  await conversationRepository.markMessagesRead(conversationId, userId);

  const otherUserId =
    conversation.userOneId === userId
      ? conversation.userTwoId
      : conversation.userOneId;

  emitConversationRead(otherUserId, {
    conversationId,
    readByUserId: userId,
    readAt: new Date().toISOString(),
  });

  return {
    success: true,
    message: "Conversation marked as read.",
  };
}
