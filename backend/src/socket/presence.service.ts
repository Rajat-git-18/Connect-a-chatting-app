import { connectionRepository } from "../modules/connection/connection.repository.js";
import {
  filterOnlineUserIds,
  markUserConnected,
  markUserDisconnected,
} from "./presence.store.js";
import {
  emitPresenceOffline,
  emitPresenceOnline,
  emitPresenceSnapshot,
} from "./socket.emitter.js";

async function getConnectedUserIds(userId: string) {
  const connections =
    await connectionRepository.findConnectionsForUser(userId);

  return connections.map((connection) =>
    connection.userOneId === userId
      ? connection.userTwoId
      : connection.userOneId
  );
}

export async function handleUserConnected(userId: string) {
  const becameOnline = markUserConnected(userId);
  if (!becameOnline) return;

  const connectedUserIds = await getConnectedUserIds(userId);

  for (const connectedUserId of connectedUserIds) {
    emitPresenceOnline(connectedUserId, { userId });
  }

  emitPresenceSnapshot(userId, {
    userIds: filterOnlineUserIds(connectedUserIds),
  });
}

export async function handleUserDisconnected(userId: string) {
  const becameOffline = markUserDisconnected(userId);
  if (!becameOffline) return;

  const connectedUserIds = await getConnectedUserIds(userId);

  for (const connectedUserId of connectedUserIds) {
    emitPresenceOffline(connectedUserId, { userId });
  }
}
