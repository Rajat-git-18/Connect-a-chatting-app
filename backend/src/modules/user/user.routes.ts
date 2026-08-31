import { Router } from "express";

import {
  getMyProfile,
  updateMyProfile,
  getUserProfile,
} from "./user.controller.js";

import { authenticate } from "../../middlewares/authenticate.js";

const router = Router();

router.get(
  "/me",
  authenticate,
  getMyProfile
);

router.patch(
  "/me",
  authenticate,
  updateMyProfile
);

router.get(
    "/:userId",
    authenticate,
    getUserProfile
  );

export default router;
