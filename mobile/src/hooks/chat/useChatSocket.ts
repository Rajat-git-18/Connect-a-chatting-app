import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { connectChatSocket } from "@/services/socket/chat.socket";
import {
  SOCKET_EVENTS,
  type ConversationReadPayload,
  type ConversationUpdatedPayload,
  type TypingPayload,
  type PresenceUserPayload,
  type PresenceSnapshotPayload,
  type ConnectionRequestRemovedPayload,
  type ConnectionNewPayload,
  type ConnectionRemovedPayload,
} from "@/services/socket/chat.events";
import {
  patchConversationList,
  patchConversationReadInCache,
  upsertMessageInCache,
} from "@/services/socket/chatCache";
import {
  invalidateConnectionSuggestions,
  prependConnectionToCache,
  prependIncomingRequest,
  prependOutgoingRequest,
  removeConnectionFromCache,
  removeConnectionRequestFromCache,
} from "@/services/socket/connectionCache";
import { markConversationRead } from "@/services/api/conversation.api";
import type { ChatMessage } from "@/types/chat.types";
import type { ConnectionRequestItem } from "@/types/connection.types";
import { useChatUiStore } from "@/stores/chat.store";
import { useProfile } from "@/hooks/profile/useProfile";

export function useChatSocket() {
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();
  const activeConversationId = useChatUiStore(
    (state) => state.activeConversationId
  );
  const activeConversationRef = useRef(activeConversationId);
  const profileIdRef = useRef(profile?.id);
  const setTypingForConversation = useChatUiStore(
    (state) => state.setTypingForConversation
  );
  const setUserOnline = useChatUiStore((state) => state.setUserOnline);
  const setOnlineSnapshot = useChatUiStore((state) => state.setOnlineSnapshot);

  useEffect(() => {
    activeConversationRef.current = activeConversationId;
    profileIdRef.current = profile?.id;
  }, [activeConversationId, profile?.id]);

  useEffect(() => {
    let socket: Socket | null = null;
    let isMounted = true;

    const handleMessageNew = (message: ChatMessage) => {
      upsertMessageInCache(queryClient, message.conversationId, message);
      setTypingForConversation(message.conversationId, false);

      const isActiveChat =
        message.conversationId === activeConversationRef.current;
      const isFromOther = message.senderId !== profileIdRef.current;

      if (isActiveChat && isFromOther) {
        void markConversationRead(message.conversationId).catch(() => undefined);
      }
    };

    const handleConversationUpdated = (payload: ConversationUpdatedPayload) => {
      patchConversationList(
        queryClient,
        payload,
        profileIdRef.current,
        activeConversationRef.current
      );
    };

    const handleConversationRead = (payload: ConversationReadPayload) => {
      patchConversationReadInCache(queryClient, payload);
    };

    const handleTypingStart = (payload: TypingPayload) => {
      if (payload.userId === profileIdRef.current) return;
      setTypingForConversation(payload.conversationId, true);
    };

    const handleTypingStop = (payload: TypingPayload) => {
      if (payload.userId === profileIdRef.current) return;
      setTypingForConversation(payload.conversationId, false);
    };

    const handlePresenceOnline = (payload: PresenceUserPayload) => {
      if (payload.userId === profileIdRef.current) return;
      setUserOnline(payload.userId, true);
    };

    const handlePresenceOffline = (payload: PresenceUserPayload) => {
      if (payload.userId === profileIdRef.current) return;
      setUserOnline(payload.userId, false);
    };

    const handlePresenceSnapshot = (payload: PresenceSnapshotPayload) => {
      setOnlineSnapshot(payload.userIds);
    };

    const handleConnectionRequestNew = (request: ConnectionRequestItem) => {
      prependIncomingRequest(queryClient, request, profileIdRef.current);
      prependOutgoingRequest(queryClient, request, profileIdRef.current);
      invalidateConnectionSuggestions(queryClient);
      queryClient.invalidateQueries({
        queryKey: ["connections", "status", request.sender.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["connections", "status", request.receiver.id],
      });
    };

    const handleConnectionRequestRemoved = (
      payload: ConnectionRequestRemovedPayload
    ) => {
      removeConnectionRequestFromCache(queryClient, payload.requestId);
      invalidateConnectionSuggestions(queryClient);
    };

    const handleConnectionNew = (payload: ConnectionNewPayload) => {
      prependConnectionToCache(queryClient, payload);
      invalidateConnectionSuggestions(queryClient);
      queryClient.invalidateQueries({
        queryKey: ["connections", "status", payload.user.id],
      });
    };

    const handleConnectionRemoved = (payload: ConnectionRemovedPayload) => {
      removeConnectionFromCache(queryClient, payload);
      invalidateConnectionSuggestions(queryClient);
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    };

    void (async () => {
      socket = await connectChatSocket();
      if (!socket || !isMounted) return;

      socket.on(SOCKET_EVENTS.MESSAGE_NEW, handleMessageNew);
      socket.on(SOCKET_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
      socket.on(SOCKET_EVENTS.CONVERSATION_READ, handleConversationRead);
      socket.on(SOCKET_EVENTS.TYPING_START, handleTypingStart);
      socket.on(SOCKET_EVENTS.TYPING_STOP, handleTypingStop);
      socket.on(SOCKET_EVENTS.PRESENCE_ONLINE, handlePresenceOnline);
      socket.on(SOCKET_EVENTS.PRESENCE_OFFLINE, handlePresenceOffline);
      socket.on(SOCKET_EVENTS.PRESENCE_SNAPSHOT, handlePresenceSnapshot);
      socket.on(SOCKET_EVENTS.CONNECTION_REQUEST_NEW, handleConnectionRequestNew);
      socket.on(
        SOCKET_EVENTS.CONNECTION_REQUEST_REMOVED,
        handleConnectionRequestRemoved
      );
      socket.on(SOCKET_EVENTS.CONNECTION_NEW, handleConnectionNew);
      socket.on(SOCKET_EVENTS.CONNECTION_REMOVED, handleConnectionRemoved);
    })();

    return () => {
      isMounted = false;
      socket?.off(SOCKET_EVENTS.MESSAGE_NEW, handleMessageNew);
      socket?.off(
        SOCKET_EVENTS.CONVERSATION_UPDATED,
        handleConversationUpdated
      );
      socket?.off(SOCKET_EVENTS.CONVERSATION_READ, handleConversationRead);
      socket?.off(SOCKET_EVENTS.TYPING_START, handleTypingStart);
      socket?.off(SOCKET_EVENTS.TYPING_STOP, handleTypingStop);
      socket?.off(SOCKET_EVENTS.PRESENCE_ONLINE, handlePresenceOnline);
      socket?.off(SOCKET_EVENTS.PRESENCE_OFFLINE, handlePresenceOffline);
      socket?.off(SOCKET_EVENTS.PRESENCE_SNAPSHOT, handlePresenceSnapshot);
      socket?.off(
        SOCKET_EVENTS.CONNECTION_REQUEST_NEW,
        handleConnectionRequestNew
      );
      socket?.off(
        SOCKET_EVENTS.CONNECTION_REQUEST_REMOVED,
        handleConnectionRequestRemoved
      );
      socket?.off(SOCKET_EVENTS.CONNECTION_NEW, handleConnectionNew);
      socket?.off(SOCKET_EVENTS.CONNECTION_REMOVED, handleConnectionRemoved);
    };
  }, [
    profile?.id,
    queryClient,
    setTypingForConversation,
    setUserOnline,
    setOnlineSnapshot,
  ]);
}
