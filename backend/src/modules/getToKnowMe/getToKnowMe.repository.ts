import { prisma } from "../../lib/prisma.js";

export const getToKnowMeRepository = {
  async getByUserId(userId: string) {
    return prisma.getToKnowMe.findUnique({
      where: { userId },
    });
  },

  async upsert(userId: string, question: string) {
    return prisma.getToKnowMe.upsert({
      where: { userId },
      create: { userId, question },
      update: { question },
    });
  },
};
