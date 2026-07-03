import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  findUserByEmail,
  findUserByUsername,
  createUser,
} from "./auth.repository.js";

import { env } from "../../config/env.js";

import {
  type RegisterRequest,
  type AuthResponse,
} from "./auth.types.js";
import { AppError } from "../../errors/AppError.js";
import type { StringValue } from "ms";

export async function registerUser(
    data: RegisterRequest
  ): Promise<AuthResponse> {
    const { displayName, username, email, password } = data;

    const existingEmail = await findUserByEmail(email);

    if (existingEmail) {
        throw new AppError(
            409,
            "Email already exists"
          );
    }

    const existingUsername = await findUserByUsername(username);

    if (existingUsername) {
        throw new AppError(
            409,
            "Username is already taken"
          );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
        displayName,
        username,
        email,
        passwordHash: hashedPassword,
      });

      const token = jwt.sign(
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

      return {
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: user.id,
          displayName: user.displayName,
          username: user.username,
          email: user.email,
        },
      };
  }

  