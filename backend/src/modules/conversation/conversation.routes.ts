import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { validate } from "../../middlewares/validate.js";
import {
  createConversation,
  getConversation,
  listConversations,
  listMessages,
  markConversationRead,
  sendMessage,
} from "./conversation.controller.js";
import {
  createConversationSchema,
  sendMessageSchema,
} from "./conversation.schema.js";

const router = Router();

router.get("/", authenticate, listConversations);

router.post(
  "/",
  authenticate,
  validate(createConversationSchema),
  createConversation
);

router.get("/:conversationId", authenticate, getConversation);

router.get("/:conversationId/messages", authenticate, listMessages);

router.post(
  "/:conversationId/messages",
  authenticate,
  validate(sendMessageSchema),
  sendMessage
);

router.patch("/:conversationId/read", authenticate, markConversationRead);

export default router;
