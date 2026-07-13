import { prisma } from "../../lib/prisma.js";
import type { Prisma, User } from "@prisma/client";

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findFirst({
    where: {
      email: { equals: email.trim().toLowerCase(), mode: "insensitive" },
    },
  });
}

export async function findUserByUsername(
  username: string
): Promise<User | null> {
  return prisma.user.findFirst({
    where: {
      username: { equals: username.trim().toLowerCase(), mode: "insensitive" },
    },
  });
}

export async function createUser(
  data: Prisma.UserCreateInput
): Promise<User> {
  return prisma.user.create({
    data,
  });
}


export async function findUserByIdentifier(identifier: string) {
  const normalized = identifier.trim().toLowerCase();

  return prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: normalized, mode: "insensitive" } },
        { username: { equals: normalized, mode: "insensitive" } },
      ],
    },
  });
}

  export async function findUserById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }