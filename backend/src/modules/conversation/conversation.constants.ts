export { orderConnectionUserIds as orderConversationUserIds } from "../connection/connection.constants.js";

export const chatUserSelect = {
  id: true,
  username: true,
  displayName: true,
  profileImage: true,
} as const;

export const DEFAULT_MESSAGE_PAGE_SIZE = 30;
