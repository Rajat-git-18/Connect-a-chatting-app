import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { validate } from "../../middlewares/validate.js";
import {
  acceptConnectionRequest,
  cancelConnectionRequest,
  getConnectionStatus,
  getConnectionSuggestions,
  getConnections,
  getIncomingConnectionRequests,
  getOutgoingConnectionRequests,
  rejectConnectionRequest,
  removeConnection,
  sendConnectionRequest,
} from "./connection.controller.js";
import { sendConnectionRequestSchema } from "./connection.schema.js";

const router = Router();

router.get("/suggestions", authenticate, getConnectionSuggestions);

router.get("/", authenticate, getConnections);

router.get("/requests/incoming", authenticate, getIncomingConnectionRequests);

router.get("/requests/outgoing", authenticate, getOutgoingConnectionRequests);

router.get("/status/:userId", authenticate, getConnectionStatus);

router.post(
  "/requests",
  authenticate,
  validate(sendConnectionRequestSchema),
  sendConnectionRequest
);

router.patch(
  "/requests/:requestId/accept",
  authenticate,
  acceptConnectionRequest
);

router.patch(
  "/requests/:requestId/reject",
  authenticate,
  rejectConnectionRequest
);

router.patch(
  "/requests/:requestId/cancel",
  authenticate,
  cancelConnectionRequest
);

router.delete("/:connectionId", authenticate, removeConnection);

export default router;
