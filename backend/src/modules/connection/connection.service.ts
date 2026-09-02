import { AppError } from "../../errors/AppError.js";
import { ConnectionRequestStatus } from "@prisma/client";
import { findUserById } from "../auth/auth.repository.js";
import { getToKnowMeRepository } from "../getToKnowMe/getToKnowMe.repository.js";
import { connectionRepository } from "./connection.repository.js";
import type {
  ConnectionRelationshipStatus,
  ConnectionStatusData,
  ConnectionSuggestion,
  ConnectionRequestItem,
  ConnectionFriendItem,
  SendConnectionRequestBody,
} from "./connection.types.js";

function mapConnectionRequest(request: {
  id: string;
  status: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
  sender: ConnectionRequestItem["sender"];
  receiver: ConnectionRequestItem["receiver"];
  question: ConnectionRequestItem["question"];
}): ConnectionRequestItem {
  return {
    id: request.id,
    status: request.status,
    answer: request.answer,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    sender: request.sender,
    receiver: request.receiver,
    question: request.question,
  };
}

export async function getIncomingConnectionRequestsService(
  currentUserId: string
) {
  const requests =
    await connectionRepository.findIncomingRequests(currentUserId);

  return {
    success: true,
    message: "Incoming connection requests fetched successfully.",
    data: requests.map(mapConnectionRequest),
  };
}

export async function getOutgoingConnectionRequestsService(
  currentUserId: string
) {
  const requests =
    await connectionRepository.findOutgoingRequests(currentUserId);

  return {
    success: true,
    message: "Outgoing connection requests fetched successfully.",
    data: requests.map(mapConnectionRequest),
  };
}

export async function getConnectionsService(currentUserId: string) {
  const connections =
    await connectionRepository.findConnectionsForUser(currentUserId);

  const data: ConnectionFriendItem[] = connections.map((connection) => {
    const user =
      connection.userOneId === currentUserId
        ? connection.userTwo
        : connection.userOne;

    return {
      id: connection.id,
      connectedAt: connection.createdAt,
      user,
    };
  });

  return {
    success: true,
    message: "Connections fetched successfully.",
    data,
  };
}

export async function acceptConnectionRequestService(
  currentUserId: string,
  requestId: string
) {
  const request = await connectionRepository.acceptConnectionRequest(
    requestId,
    currentUserId
  );

  if (!request) {
    const existing = await connectionRepository.findRequestById(requestId);

    if (!existing) {
      throw new AppError(404, "Connection request not found.");
    }

    if (existing.receiverId !== currentUserId) {
      throw new AppError(
        403,
        "You are not allowed to accept this connection request."
      );
    }

    throw new AppError(409, "This connection request is no longer pending.");
  }

  return {
    success: true,
    message: "Connection request accepted.",
    data: mapConnectionRequest(request),
  };
}

export async function rejectConnectionRequestService(
  currentUserId: string,
  requestId: string
) {
  const existing = await connectionRepository.findRequestById(requestId);

  if (!existing) {
    throw new AppError(404, "Connection request not found.");
  }

  if (existing.receiverId !== currentUserId) {
    throw new AppError(
      403,
      "You are not allowed to reject this connection request."
    );
  }

  if (existing.status !== ConnectionRequestStatus.PENDING) {
    throw new AppError(409, "This connection request is no longer pending.");
  }

  const request = await connectionRepository.updateRequestStatus(
    requestId,
    ConnectionRequestStatus.REJECTED
  );

  return {
    success: true,
    message: "Connection request rejected.",
    data: mapConnectionRequest(request),
  };
}

export async function cancelConnectionRequestService(
  currentUserId: string,
  requestId: string
) {
  const existing = await connectionRepository.findRequestById(requestId);

  if (!existing) {
    throw new AppError(404, "Connection request not found.");
  }

  if (existing.senderId !== currentUserId) {
    throw new AppError(
      403,
      "You are not allowed to cancel this connection request."
    );
  }

  if (existing.status !== ConnectionRequestStatus.PENDING) {
    throw new AppError(409, "This connection request is no longer pending.");
  }

  const request = await connectionRepository.updateRequestStatus(
    requestId,
    ConnectionRequestStatus.CANCELLED
  );

  return {
    success: true,
    message: "Connection request cancelled.",
    data: mapConnectionRequest(request),
  };
}

export async function getConnectionSuggestionsService(
  currentUserId: string
): Promise<{
  success: boolean;
  message: string;
  data: ConnectionSuggestion[];
}> {
  const users = await connectionRepository.findSuggestions(currentUserId);

  return {
    success: true,
    message: "Connection suggestions fetched successfully.",
    data: users.map((user) => ({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      profileImage: user.profileImage,
      bio: user.bio,
      hasConnectionQuestion: !!user.getToKnowMe,
    })),
  };
}

export async function getConnectionStatusService(
  currentUserId: string,
  otherUserId: string
): Promise<{
  success: boolean;
  message: string;
  data: ConnectionStatusData;
}> {
  if (currentUserId === otherUserId) {
    return {
      success: true,
      message: "This is your profile.",
      data: { status: "SELF" },
    };
  }

  const otherUser = await findUserById(otherUserId);

  if (!otherUser) {
    throw new AppError(404, "User not found.");
  }

  const existingConnection =
    await connectionRepository.findConnectionBetween(
      currentUserId,
      otherUserId
    );

  if (existingConnection) {
    return {
      success: true,
      message: "You are connected with this user.",
      data: {
        status: "CONNECTED",
        connectionId: existingConnection.id,
      },
    };
  }

  const pendingRequest =
    await connectionRepository.findPendingRequestBetween(
      currentUserId,
      otherUserId
    );

  if (pendingRequest) {
    const status: ConnectionRelationshipStatus =
      pendingRequest.senderId === currentUserId
        ? "PENDING_SENT"
        : "PENDING_RECEIVED";

    return {
      success: true,
      message: "Connection request is pending.",
      data: {
        status,
        requestId: pendingRequest.id,
      },
    };
  }

  const question = await getToKnowMeRepository.getByUserId(otherUserId);

  if (!question) {
    return {
      success: true,
      message: "This user has not set a connection question yet.",
      data: { status: "NO_QUESTION" },
    };
  }

  return {
    success: true,
    message: "You can send a connection request.",
    data: { status: "NONE" },
  };
}

export async function sendConnectionRequestService(
  senderId: string,
  data: SendConnectionRequestBody
) {
  const { receiverId, answer } = data;

  if (senderId === receiverId) {
    throw new AppError(400, "You cannot send a connection request to yourself.");
  }

  const receiver = await findUserById(receiverId);

  if (!receiver) {
    throw new AppError(404, "User not found.");
  }

  const question = await getToKnowMeRepository.getByUserId(receiverId);

  if (!question) {
    throw new AppError(
      400,
      "This user has not set a connection question yet."
    );
  }

  const existingConnection =
    await connectionRepository.findConnectionBetween(senderId, receiverId);

  if (existingConnection) {
    throw new AppError(409, "You are already connected with this user.");
  }

  const pendingRequest =
    await connectionRepository.findPendingRequestBetween(senderId, receiverId);

  if (pendingRequest) {
    throw new AppError(
      409,
      "A connection request already exists between you and this user."
    );
  }

  const request = await connectionRepository.createConnectionRequest({
    senderId,
    receiverId,
    questionId: question.id,
    answer: answer.trim(),
  });

  return {
    success: true,
    message: "Connection request sent successfully.",
    data: {
      id: request.id,
      receiverId: request.receiverId,
      status: request.status,
      createdAt: request.createdAt,
      receiver: request.receiver,
    },
  };
}

export async function removeConnectionService(
  currentUserId: string,
  connectionId: string
) {
  const connection =
    await connectionRepository.findConnectionById(connectionId);

  if (!connection) {
    throw new AppError(404, "Connection not found.");
  }

  if (
    connection.userOneId !== currentUserId &&
    connection.userTwoId !== currentUserId
  ) {
    throw new AppError(403, "You are not allowed to remove this connection.");
  }

  await connectionRepository.deleteConnectionById(connectionId);

  return {
    success: true,
    message: "Connection removed successfully.",
  };
}
