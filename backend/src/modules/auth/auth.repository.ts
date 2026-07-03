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