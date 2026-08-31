import { prisma } from "../../lib/prisma.js";
import type { UpdateProfileRequest } from "./user.types.js";

export async function findUserById(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
}

export async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      profileImage: true,
      bio: true,
      createdAt: true,

      _count: {
        select: {
          threads: true,
          replies: true,
          reactions: true,
        },
      },
    },
  });
}

export async function updateUserProfile(
  userId: string,
  data: UpdateProfileRequest
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      displayName: data.displayName,
      bio: data.bio ?? null,
    },
  });
}