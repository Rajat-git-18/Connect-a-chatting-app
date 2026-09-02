import type { Socket } from "socket.io";
import { connectionRepository } from "../modules/connection/connection.repository.js";
import { conversationRepository } from "../modules/conversation/conversation.repository.js";
import { getSocketServer } from "./socket.emitter.js";
import { SOCKET_EVENTS, userRoom } from "./socket.events.js";

type TypingPayload = {
  conversationId: string;
};

async function getOtherParticipantId(
  conversationId: string,
  userId: string
): Promise<string | null> {
  const conversation = await conversationRepository.findById(conversationId);

  if (!conversation) return null;

  if (
    conversation.userOneId !== userId &&
    conversation.userTwoId !== userId
  ) {
    return null;
  }

  return conversation.userOneId === userId
    ? conversation.userTwoId
    : conversation.userOneId;
}

function relayTypingEvent(
  otherUserId: string,
  event: typeof SOCKET_EVENTS.TYPING_START | typeof SOCKET_EVENTS.TYPING_STOP,
  payload: { conversationId: string; userId: string }
) {
  getSocketServer().to(userRoom(otherUserId)).emit(event, payload);
}

export function registerChatSocketHandlers(socket: Socket) {
  const userId = socket.data.userId as string;

  socket.on(SOCKET_EVENTS.TYPING_START, async (payload: TypingPayload) => {
    if (!payload?.conversationId) return;

    const otherUserId = await getOtherParticipantId(
      payload.conversationId,
      userId
    );

    if (!otherUserId) return;

    const connection = await connectionRepository.findConnectionBetween(
      userId,
      otherUserId
    );

    if (!connection) return;

    relayTypingEvent(otherUserId, SOCKET_EVENTS.TYPING_START, {
      conversationId: payload.conversationId,
      userId,
    });
  });

  socket.on(SOCKET_EVENTS.TYPING_STOP, async (payload: TypingPayload) => {
    if (!payload?.conversationId) return;

    const otherUserId = await getOtherParticipantId(
      payload.conversationId,
      userId
    );

    if (!otherUserId) return;

    const connection = await connectionRepository.findConnectionBetween(
      userId,
      otherUserId
    );

    if (!connection) return;

    relayTypingEvent(otherUserId, SOCKET_EVENTS.TYPING_STOP, {
      conversationId: payload.conversationId,
      userId,
    });
  });
}
