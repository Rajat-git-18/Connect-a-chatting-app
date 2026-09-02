import { ConnectionRequestStatus } from "@prisma/client";

import { prisma } from "../../lib/prisma.js";
import {
  connectionRequestInclude,
  orderConnectionUserIds,
} from "./connection.constants.js";

function getOtherUserId(
  connection: { userOneId: string; userTwoId: string },
  currentUserId: string
) {
  return connection.userOneId === currentUserId
    ? connection.userTwoId
    : connection.userOneId;
}

export const connectionRepository = {
  async findRequestById(requestId: string) {
    return prisma.connectionRequest.findUnique({
      where: { id: requestId },
      include: connectionRequestInclude,
    });
  },

  async findConnectionBetween(userAId: string, userBId: string) {
    return prisma.connection.findFirst({
      where: {
        OR: [
          { userOneId: userAId, userTwoId: userBId },
          { userOneId: userBId, userTwoId: userAId },
        ],
      },
    });
  },

  async findConnectionById(connectionId: string) {
    return prisma.connection.findUnique({
      where: { id: connectionId },
    });
  },

  async deleteConnectionById(connectionId: string) {
    return prisma.connection.delete({
      where: { id: connectionId },
    });
  },

  async findPendingRequestBetween(userAId: string, userBId: string) {
    return prisma.connectionRequest.findFirst({
      where: {
        status: ConnectionRequestStatus.PENDING,
        OR: [
          { senderId: userAId, receiverId: userBId },
          { senderId: userBId, receiverId: userAId },
        ],
      },
    });
  },

  async createConnectionRequest(data: {
    senderId: string;
    receiverId: string;
    questionId: string;
    answer: string;
  }) {
    return prisma.connectionRequest.create({
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId,
        questionId: data.questionId,
        answer: data.answer,
      },
      include: {
        receiver: {
          select: {
            id: true,
            displayName: true,
            username: true,
          },
        },
      },
    });
  },

  async getExcludedUserIds(currentUserId: string) {
    const [connections, pendingRequests] = await Promise.all([
      prisma.connection.findMany({
        where: {
          OR: [{ userOneId: currentUserId }, { userTwoId: currentUserId }],
        },
        select: { userOneId: true, userTwoId: true },
      }),
      prisma.connectionRequest.findMany({
        where: {
          status: ConnectionRequestStatus.PENDING,
          OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
        },
        select: { senderId: true, receiverId: true },
      }),
    ]);

    const excluded = new Set<string>([currentUserId]);

    for (const connection of connections) {
      excluded.add(getOtherUserId(connection, currentUserId));
    }

    for (const request of pendingRequests) {
      excluded.add(
        request.senderId === currentUserId
          ? request.receiverId
          : request.senderId
      );
    }

    return Array.from(excluded);
  },

  async findSuggestions(currentUserId: string, limit = 12) {
    const excludedUserIds = await this.getExcludedUserIds(currentUserId);

    return prisma.user.findMany({
      where: {
        id: { notIn: excludedUserIds },
        getToKnowMe: { isNot: null },
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        profileImage: true,
        bio: true,
        getToKnowMe: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  async findIncomingRequests(userId: string) {
    return prisma.connectionRequest.findMany({
      where: {
        receiverId: userId,
        status: ConnectionRequestStatus.PENDING,
      },
      include: connectionRequestInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  async findOutgoingRequests(userId: string) {
    return prisma.connectionRequest.findMany({
      where: {
        senderId: userId,
        status: ConnectionRequestStatus.PENDING,
      },
      include: connectionRequestInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  async findConnectionsForUser(userId: string) {
    return prisma.connection.findMany({
      where: {
        OR: [{ userOneId: userId }, { userTwoId: userId }],
      },
      include: {
        userOne: {
          select: {
            id: true,
            username: true,
            displayName: true,
            profileImage: true,
            bio: true,
          },
        },
        userTwo: {
          select: {
            id: true,
            username: true,
            displayName: true,
            profileImage: true,
            bio: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async acceptConnectionRequest(requestId: string, receiverId: string) {
    return prisma.$transaction(async (tx) => {
      const request = await tx.connectionRequest.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        return null;
      }

      if (request.receiverId !== receiverId) {
        return null;
      }

      if (request.status !== ConnectionRequestStatus.PENDING) {
        return null;
      }

      const existingConnection = await tx.connection.findFirst({
        where: {
          OR: [
            { userOneId: request.senderId, userTwoId: request.receiverId },
            { userOneId: request.receiverId, userTwoId: request.senderId },
          ],
        },
      });

      if (!existingConnection) {
        const [userOneId, userTwoId] = orderConnectionUserIds(
          request.senderId,
          request.receiverId
        );

        await tx.connection.create({
          data: {
            userOneId,
            userTwoId,
          },
        });
      }

      return tx.connectionRequest.update({
        where: { id: requestId },
        data: { status: ConnectionRequestStatus.ACCEPTED },
        include: connectionRequestInclude,
      });
    });
  },

  async updateRequestStatus(
    requestId: string,
    status: ConnectionRequestStatus
  ) {
    return prisma.connectionRequest.update({
      where: { id: requestId },
      data: { status },
      include: connectionRequestInclude,
    });
  },
};
