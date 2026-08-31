export function orderConnectionUserIds(
  userAId: string,
  userBId: string
): [string, string] {
  return userAId < userBId ? [userAId, userBId] : [userBId, userAId];
}

export const connectionUserSelect = {
  id: true,
  username: true,
  displayName: true,
  profileImage: true,
  bio: true,
} as const;

export const connectionRequestInclude = {
  sender: {
    select: connectionUserSelect,
  },
  receiver: {
    select: connectionUserSelect,
  },
  question: {
    select: {
      id: true,
      question: true,
    },
  },
} as const;
