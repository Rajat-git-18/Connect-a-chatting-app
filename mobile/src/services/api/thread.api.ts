import api from "./client";
import {
  CreateThreadRequest,
  GetThreadResponse,
  GetThreadsResponse,
  Thread,
  ThreadDetail,
  ReactionType,
} from "../../types/thread.types";

// Get all threads
export const getAllThreads = async (): Promise<Thread[]> => {
  const response = await api.get<GetThreadsResponse>("/threads");
  return Array.isArray(response.data.data) ? response.data.data : [];
};

// Get threads authored by the current user
export const getMyThreads = async (): Promise<Thread[]> => {
  const response = await api.get<GetThreadsResponse>("/threads/mine");
  return Array.isArray(response.data.data) ? response.data.data : [];
};

// Get thread by id
export const getThreadById = async (
  threadId: string
): Promise<ThreadDetail> => {
  const response = await api.get<GetThreadResponse>(`/threads/${threadId}`);
  return response.data.data;
};

// Create thread
export const createThread = async (data: CreateThreadRequest) => {
  const response = await api.post("/threads", data);
  return response.data.data;
};

// Create reply
export const createReply = async (
  threadId: string,
  content: string
) => {
  const response = await api.post(`/threads/${threadId}/replies`, {
    content,
  });

  return response.data.data;
};

// React to thread
export const reactToThread = async (
  threadId: string,
  type: ReactionType
) => {
  const response = await api.post(`/threads/${threadId}/reactions`, {
    type,
  });

  return response.data.data;
};

// React to reply (toggle)
export const reactToReply = async (
  threadId: string,
  replyId: string,
  type: ReactionType
) => {
  const response = await api.post(
    `/threads/${threadId}/replies/${replyId}/reactions`,
    { type }
  );

  return response.data.data;
};

// Resolve thread
export const resolveThread = async (
  threadId: string,
  replyId: string
) => {
  const response = await api.patch(`/threads/${threadId}/resolve`, {
    replyId,
  });

  return response.data.data;
};

// Delete thread
export const deleteThread = async (threadId: string) => {
  const response = await api.delete(`/threads/${threadId}`);

  return response.data.data;
};