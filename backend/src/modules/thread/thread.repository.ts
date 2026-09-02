import {
  Prisma,
  ReactionType,
  ThreadStatus,
  ThreadVisibility,
} from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

type CreateThreadRepositoryInput = Prisma.ThreadUncheckedCreateInput;

export async function createThread(
  data: CreateThreadRepositoryInput
) {
  return prisma.thread.create({
    data,
  });
}

export async function findThreadById(id: string) {
    return prisma.thread.findUnique({
      where: {
        id,
      },
  
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            profileImage: true,
            bio: true,
          },
        },
  
        tags: {
          include: {
            tag: true,
          },
        },
  
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
  
        replies: {
          orderBy: {
            createdAt: "asc",
          },
  
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                profileImage: true,
              },
            },
  
            reactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
  
        _count: {
          select: {
            replies: true,
            reactions: true,
          },
        },
      },
    });
  }

const THREAD_LIST_INCLUDE = {
  author: {
    select: {
      id: true,
      username: true,
      displayName: true,
      profileImage: true,
    },
  },

  tags: {
    include: {
      tag: true,
    },
  },

  replies: {
    select: {
      _count: {
        select: {
          reactions: true,
        },
      },
    },
  },

  _count: {
    select: {
      replies: true,
      reactions: true,
    },
  },
} satisfies Prisma.ThreadInclude;

type ThreadListRow = Prisma.ThreadGetPayload<{
  include: typeof THREAD_LIST_INCLUDE;
}>;

// Reactions live on both the thread and its replies, so the list count should
// reflect the combined total to match the thread detail screen.
function withCombinedReactionCount({ replies, ...thread }: ThreadListRow) {
  const replyReactions = replies.reduce(
    (sum, reply) => sum + reply._count.reactions,
    0
  );

  return {
    ...thread,
    _count: {
      replies: thread._count.replies,
      reactions: thread._count.reactions + replyReactions,
    },
  };
}

export async function findVisibleThreadsForViewer(
  viewerId: string,
  connectedAuthorIds: string[]
) {
  const threads = await prisma.thread.findMany({
    where: {
      OR: [
        { visibility: ThreadVisibility.PUBLIC },
        { authorId: viewerId },
        {
          visibility: ThreadVisibility.FRIENDS,
          authorId: { in: connectedAuthorIds },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: THREAD_LIST_INCLUDE,
  });

  return threads.map(withCombinedReactionCount);
}

export async function findThreadsByAuthor(authorId: string) {
    const threads = await prisma.thread.findMany({
      where: {
        authorId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: THREAD_LIST_INCLUDE,
    });

    return threads.map(withCombinedReactionCount);
  }

export async function updateThreadStatus(
    id: string,
    status: ThreadStatus
  ) {
    return prisma.thread.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

export async function deleteThread(id: string) {
  return prisma.thread.delete({
    where: {
      id,
    },
  });
}



export async function createReply(
    threadId: string,
    authorId: string,
    content: string,
    imageUrl: string | null = null
  ) {
    return prisma.reply.create({
      data: {
        threadId,
        authorId,
        content,
        imageUrl: imageUrl || null,
      },
    }); 
  }
  
  export async function findRepliesByThreadId(
    threadId: string
  ) {
    return prisma.reply.findMany({
      where: {
        threadId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
  
  export async function findReplyById(id: string) {
    return prisma.reply.findUnique({
      where: {
        id,
      },
    });
  }

  export async function markBestReply(replyId: string) {
    return prisma.reply.update({
      where: {
        id: replyId,
      },
      data: {
        isBestReply: true,
      },
    });
  }

  export async function unmarkBestReplies(threadId: string) {
    return prisma.reply.updateMany({
      where: {
        threadId,
      },
      data: {
        isBestReply: false,
      },
    });
  }



export async function findReaction(
  userId: string,
  threadId: string,
  type: ReactionType
) {
  return prisma.reaction.findUnique({
    where: {
      userId_threadId_type: {
        userId,
        threadId,
        type,
      },
    },
  });
}

export async function findReplyReaction(
  userId: string,
  replyId: string,
  type: ReactionType
) {
  return prisma.reaction.findUnique({
    where: {
      userId_replyId_type: {
        userId,
        replyId,
        type,
      },
    },
  });
}

export async function createReaction(
  userId: string,
  threadId: string,
  type: ReactionType
) {
  return prisma.reaction.create({
    data: {
      userId,
      threadId,
      type,
    },
  });
}

export async function createReplyReaction(
  userId: string,
  replyId: string,
  type: ReactionType
) {
  return prisma.reaction.create({
    data: {
      userId,
      replyId,
      type,
    },
  });
}

export async function deleteReaction(id: string) {
  return prisma.reaction.delete({
    where: { id },
  });
}

export async function findTagsByNames(names: string[]) {
    return prisma.tag.findMany({
      where: {
        name: {
          in: names,
        },
      },
    });
  }
  
  export async function createTag(name: string) {
    return prisma.tag.create({
      data: {
        name,
      },
    });
  }

  export async function createThreadTags(
    threadId: string,
    tagIds: string[]
  ) {
    return prisma.threadTag.createMany({
      data: tagIds.map((tagId) => ({
        threadId,
        tagId,
      })),
    });
  }