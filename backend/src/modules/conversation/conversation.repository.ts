import { prisma } from "../../lib/prisma.js";
import {
  chatUserSelect,
  DEFAULT_MESSAGE_PAGE_SIZE,
  orderConversationUserIds,
} from "./conversation.constants.js";

const messageInclude = {
  sender: {
    select: chatUserSelect,
  },
} as const;

export const conversationRepository = {
  async findById(conversationId: string) {
    return prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        userOne: { select: chatUserSelect },
        userTwo: { select: chatUserSelect },
      },
    });
  },

  async findBetweenUsers(userAId: string, userBId: string) {
    const [userOneId, userTwoId] = orderConversationUserIds(userAId, userBId);

    return prisma.conversation.findUnique({
      where: {
        userOneId_userTwoId: { userOneId, userTwoId },
      },
      include: {
        userOne: { select: chatUserSelect },
        userTwo: { select: chatUserSelect },
      },
    });
  },

  async create(userAId: string, userBId: string) {
    const [userOneId, userTwoId] = orderConversationUserIds(userAId, userBId);

    return prisma.conversation.create({
      data: { userOneId, userTwoId },
      include: {
        userOne: { select: chatUserSelect },
        userTwo: { select: chatUserSelect },
      },
    });
  },

  async findForUser(userId: string) {
    return prisma.conversation.findMany({
      where: {
        OR: [{ userOneId: userId }, { userTwoId: userId }],
      },
      include: {
        userOne: { select: chatUserSelect },
        userTwo: { select: chatUserSelect },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: messageInclude,
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  },

  async countUnread(conversationId: string, userId: string) {
    return prisma.message.count({
      where: {
        conversationId,
        senderId: { not: userId },
        readAt: null,
      },
    });
  },

  async findMessagesPage(
    conversationId: string,
    cursor: string | undefined,
    limit = DEFAULT_MESSAGE_PAGE_SIZE
  ) {
    const cursorMessage = cursor
      ? await prisma.message.findUnique({
          where: { id: cursor },
          select: { id: true, createdAt: true, conversationId: true },
        })
      : null;

    if (cursor && (!cursorMessage || cursorMessage.conversationId !== conversationId)) {
      return [];
    }

    return prisma.message.findMany({
      where: {
        conversationId,
        ...(cursorMessage
          ? {
              OR: [
                { createdAt: { lt: cursorMessage.createdAt } },
                {
                  createdAt: cursorMessage.createdAt,
                  id: { lt: cursorMessage.id },
                },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit,
      include: messageInclude,
    });
  },

  async createMessage(data: {
    conversationId: string;
    senderId: string;
    content: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          conversationId: data.conversationId,
          senderId: data.senderId,
          content: data.content,
        },
        include: messageInclude,
      });

      await tx.conversation.update({
        where: { id: data.conversationId },
        data: { updatedAt: message.createdAt },
      });

      return message;
    });
  },

  async markMessagesRead(conversationId: string, userId: string) {
    return prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  },
};
