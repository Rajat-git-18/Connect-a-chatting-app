import { useEffect, useRef } from "react";
import { getChatSocket } from "@/services/socket/chat.socket";
import { SOCKET_EVENTS } from "@/services/socket/chat.events";

const TYPING_STOP_DELAY_MS = 2500;

export function useTypingEmitter(conversationId: string, draft: string) {
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const lastEmittedRef = useRef("");

  useEffect(() => {
    return () => {
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
      }

      const socket = getChatSocket();
      if (socket?.connected && isTypingRef.current && conversationId) {
        socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId });
      }
    };
  }, [conversationId]);

  useEffect(() => {
    const socket = getChatSocket();
    if (!socket?.connected || !conversationId) return;

    const trimmed = draft.trim();

    if (!trimmed) {
      if (isTypingRef.current) {
        socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId });
        isTypingRef.current = false;
      }
      lastEmittedRef.current = "";
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = null;
      }
      return;
    }

    if (!isTypingRef.current || lastEmittedRef.current !== trimmed) {
      socket.emit(SOCKET_EVENTS.TYPING_START, { conversationId });
      isTypingRef.current = true;
      lastEmittedRef.current = trimmed;
    }

    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
    }

    stopTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId });
        isTypingRef.current = false;
        lastEmittedRef.current = "";
      }
    }, TYPING_STOP_DELAY_MS);
  }, [conversationId, draft]);
}

export function stopTyping(conversationId: string) {
  const socket = getChatSocket();
  if (!socket?.connected || !conversationId) return;
  socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId });
}
