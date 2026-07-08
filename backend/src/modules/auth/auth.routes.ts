import { Router } from "express";

import { login, me, register, logout } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post(
    "/login",
    validate(loginSchema),
    login
  );

  router.get(
    "/me",
    authenticate,
    me
  );

  router.post(
    "/logout",
    authenticate,
    logout
  );

export default router;