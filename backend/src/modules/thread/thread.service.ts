import { ThreadStatus } from "@prisma/client";

import {
  createThread,
  createTag,
  createThreadTags,
  findTagsByNames,
  findThreadById,
  findAllThreads,
  createReply,
  findReplyById,
  markBestReply,
  unmarkBestReplies,
  updateThreadStatus,
  deleteThread,
  findReaction,
  createReaction,
} from "./thread.repository.js";

import {
  type CreateThreadRequest,
  type ReplyRequest,
  type ReactionRequest,
  type ResolveThreadRequest,
} from "./thread.types.js";

import { AppError } from "../../errors/AppError.js";



export async function createThreadService(
    authorId: string,
    data: CreateThreadRequest
  ) {
    const title = data.title.trim();

    const discussion = data.discussion.trim();

    if (!title || !discussion) {
    throw new AppError(
        400,
        "Title and discussion are required."
    );
    }

    const tags = [...new Set(
        (data.tags ?? []).map(tag =>
            tag.trim().toLowerCase()
        )
    )];

    const existingTags =
    await findTagsByNames(tags);

    const existingNames = new Set(
        existingTags.map(tag => tag.name)
      );

      const missingTags = tags.filter(
        tag => !existingNames.has(tag)
      );

    for (const tag of missingTags) {
        await createTag(tag);
    }

    const finalTags =
    await findTagsByNames(tags);

    const thread =
    await createThread({
        title,
        discussion,
        category: data.category,
        visibility: data.visibility,
        imageUrl: data.imageUrl ?? null,
        authorId,
    });

    await createThreadTags(
        thread.id,
        finalTags.map(tag => tag.id)
    );

    return {
        success: true,
        message: "Thread created successfully.",
        data: thread,
    };
  }


  export async function getAllThreadsService() {
    const threads = await findAllThreads();
  
    return {
      success: true,
      message: "Threads fetched successfully.",
      data: threads,
    };
  }

  export async function getThreadByIdService(
    threadId: string
  ) {
    const thread = await findThreadById(threadId);
  
    if (!thread) {
      throw new AppError(
        404,
        "Thread not found."
      );
    }
  
    return {
      success: true,
      message: "Thread fetched successfully.",
      data: thread,
    };
  }

  export async function createReplyService(
    threadId: string,
    authorId: string,
    data: ReplyRequest
  ) {
    const thread = await findThreadById(threadId);
  
    if (!thread) {
      throw new AppError(
        404,
        "Thread not found."
      );
    }
  
    if (thread.status !== ThreadStatus.OPEN) {
      throw new AppError(
        400,
        "Replies are disabled for this thread."
      );
    }

    const content = data.content.trim();

    if (!content) {
    throw new AppError(
        400,
        "Reply content is required."
    );
    }

    const imageUrl = data.imageUrl ?? null;
  
    const reply = await createReply(
      threadId,
      authorId,
      content,
      imageUrl
    );
  
    return {
      success: true,
      message: "Reply added successfully.",
      data: reply,
    };
  }

  export async function reactToThreadService(
    threadId: string,
    userId: string,
    data: ReactionRequest
  ) {
    const thread = await findThreadById(threadId);
  
    if (!thread) {
      throw new AppError(
        404,
        "Thread not found."
      );
    }
  
    const existingReaction = await findReaction(
      userId,
      threadId,
      data.type
    );
  
    if (existingReaction) {
      throw new AppError(
        409,
        "You have already added this reaction."
      );
    }
  
    const reaction = await createReaction(
      userId,
      threadId,
      data.type
    );
  
    return {
      success: true,
      message: "Reaction added successfully.",
      data: reaction,
    };
  }


  export async function resolveThreadService(
    threadId: string,
    userId: string,
    data: ResolveThreadRequest
  ) {
    // 1. Find thread
    const thread = await findThreadById(threadId);
  
    if (!thread) {
      throw new AppError(
        404,
        "Thread not found."
      );
    }
  
    // 2. Only author can resolve
    if (thread.authorId !== userId) {
      throw new AppError(
        403,
        "Only the thread author can resolve it."
      );
    }
  
    // 3. Find reply
    const reply = await findReplyById(data.replyId);
  
    if (!reply) {
      throw new AppError(
        404,
        "Reply not found."
      );
    }
  
    // 4. Reply must belong to this thread
    if (reply.threadId !== threadId) {
      throw new AppError(
        400,
        "Reply does not belong to this thread."
      );
    }
  
    // 5. Remove previous best reply
    await unmarkBestReplies(threadId);
  
    // 6. Mark selected reply
    await markBestReply(reply.id);
  
    // 7. Mark thread solved
    await updateThreadStatus(
      threadId,
      ThreadStatus.SOLVED
    );
  
    return {
      success: true,
      message: "Thread resolved successfully.",
    };
  }

  export async function deleteThreadService(
    threadId: string,
    userId: string
  ) {
    const thread = await findThreadById(threadId);
  
    if (!thread) {
      throw new AppError(
        404,
        "Thread not found."
      );
    }
  
    if (thread.authorId !== userId) {
      throw new AppError(
        403,
        "Only the thread author can delete it."
      );
    }
  
    await deleteThread(threadId);
  
    return {
      success: true,
      message: "Thread deleted successfully.",
    };
  }

  