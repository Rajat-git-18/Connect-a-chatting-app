import { prisma } from "../../lib/prisma.js";
import type { Prisma, User } from "@prisma/client";

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findUserByUsername(
  username: string
): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      username,
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
    return prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
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