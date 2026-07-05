import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import type { StringValue } from "ms";
import type { JwtPayload } from "../types/express.js";
import { env } from "../config/env.js";

export function generateAccessToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN as StringValue,
    }
  );
}

export function verifyAccessToken(
    token: string
  ): JwtPayload {
    return jwt.verify(
      token,
      env.JWT_SECRET
    ) as JwtPayload;
  }

