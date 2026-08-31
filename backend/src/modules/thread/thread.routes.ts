import { Router } from "express";

import {
  createThread,
  getAllThreads,
  getMyThreads,
  getThreadById,
  createReply,
  reactToThread,
  reactToReply,
  resolveThread,
  deleteThread,
} from "./thread.controller.js";

import { authenticate } from "../../middlewares/authenticate.js";
import { validate } from "../../middlewares/validate.js";
import { reactionSchema } from "./thread.schema.js";

const router = Router();

// Thread
router.post("/", authenticate, createThread);

router.get("/", authenticate, getAllThreads);

// Must be registered before "/:threadId" so it isn't matched as an id.
router.get("/mine", authenticate, getMyThreads);

router.get("/:threadId", authenticate, getThreadById);

// Reply
router.post(
  "/:threadId/replies",
  authenticate,
  createReply
);

// Reaction
router.post(
  "/:threadId/reactions",
  authenticate,
  validate(reactionSchema),
  reactToThread
);

router.post(
  "/:threadId/replies/:replyId/reactions",
  authenticate,
  validate(reactionSchema),
  reactToReply
);

// Resolve
router.patch(
  "/:threadId/resolve",
  authenticate,
  resolveThread
);

// Delete
router.delete(
  "/:threadId",
  authenticate,
  deleteThread
);

export default router;