import {
    ThreadCategory,
    ThreadStatus,
    ThreadVisibility,
    ReactionType,
  } from "@prisma/client";
  
  export interface CreateThreadRequest {
    title: string;
    discussion: string;
    category: ThreadCategory;
    visibility: ThreadVisibility;
    imageUrl?: string;
    tags?: string[];
  }
  
  export interface ReplyRequest {
    content: string;
    imageUrl?: string;
  }
  
  export interface ReactionRequest {
    type: ReactionType;
  }
  
  export interface ResolveThreadRequest {
    replyId: string;
  }
  
  export interface ThreadResponse {
    success: boolean;
    message: string;
  }