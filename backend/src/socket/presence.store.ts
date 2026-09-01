const onlineCounts = new Map<string, number>();

export function markUserConnected(userId: string): boolean {
  const currentCount = onlineCounts.get(userId) ?? 0;
  onlineCounts.set(userId, currentCount + 1);
  return currentCount === 0;
}

export function markUserDisconnected(userId: string): boolean {
  const currentCount = onlineCounts.get(userId) ?? 0;

  if (currentCount <= 1) {
    onlineCounts.delete(userId);
    return currentCount > 0;
  }

  onlineCounts.set(userId, currentCount - 1);
  return false;
}

export function isUserOnline(userId: string): boolean {
  return (onlineCounts.get(userId) ?? 0) > 0;
}

export function filterOnlineUserIds(userIds: string[]) {
  return userIds.filter((userId) => isUserOnline(userId));
}
