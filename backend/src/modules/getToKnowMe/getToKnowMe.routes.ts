import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { validate } from "../../middlewares/validate.js";
import {
  getMyGetToKnowMe,
  getUserGetToKnowMe,
  upsertMyGetToKnowMe,
} from "./getToKnowMe.controller.js";
import { upsertGetToKnowMeSchema } from "./getToKnowMe.schema.js";

const router = Router();

router.get("/me", authenticate, getMyGetToKnowMe);

router.put(
  "/me",
  authenticate,
  validate(upsertGetToKnowMeSchema),
  upsertMyGetToKnowMe
);

router.get("/user/:userId", authenticate, getUserGetToKnowMe);

export default router;
