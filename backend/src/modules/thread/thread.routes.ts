import { Router } from "express";

import {
  createThread,
  getAllThreads,
  getThreadById,
  createReply,
  reactToThread,
  resolveThread,
  deleteThread,
} from "./thread.controller.js";

import { authenticate } from "../../middlewares/authenticate.js";

const router = Router();

// Thread
router.post("/", authenticate, createThread);

router.get("/", authenticate, getAllThreads);

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
  reactToThread
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