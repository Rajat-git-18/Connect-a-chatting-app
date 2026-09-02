import { ThreadVisibility } from "@prisma/client";

import { AppError } from "../../errors/AppError.js";
import { connectionRepository } from "../connection/connection.repository.js";

type ThreadAccess = {
  authorId: string;
  visibility: ThreadVisibility;
};

export async function getConnectedUserIds(viewerId: string) {
  const connections =
    await connectionRepository.findConnectionsForUser(viewerId);

  return connections.map((connection) =>
    connection.userOneId === viewerId
      ? connection.userTwoId
      : connection.userOneId
  );
}

export async function assertViewerCanAccessThread(
  viewerId: string,
  thread: ThreadAccess
) {
  if (thread.visibility === ThreadVisibility.PUBLIC) {
    return;
  }

  if (thread.authorId === viewerId) {
    return;
  }

  if (thread.visibility === ThreadVisibility.FRIENDS) {
    const connection = await connectionRepository.findConnectionBetween(
      viewerId,
      thread.authorId
    );

    if (!connection) {
      throw new AppError(404, "Thread not found.");
    }
  }
}
