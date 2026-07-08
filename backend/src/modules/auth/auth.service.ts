import bcrypt from "bcrypt";

import {
  findUserByEmail,
  findUserByUsername,
  createUser,
  findUserByIdentifier,
  findUserById
} from "./auth.repository.js";
import { generateAccessToken } from "../../lib/jwt.js";
import type { LoginRequest } from "./auth.types.js";

import {
  type RegisterRequest,
  type AuthResponse,
} from "./auth.types.js";
import { AppError } from "../../errors/AppError.js";


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

      const token = generateAccessToken(user);

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

  export async function loginUser(
    data: LoginRequest
  ): Promise<AuthResponse> {
    const { identifier, password } = data;

const user = await findUserByIdentifier(identifier);

if (!user) {
    throw new AppError(
      401,
      "Invalid email/username or password."
    );
  }
  
  const isPasswordValid = await bcrypt.compare(
    password,
    user.passwordHash
  );
  
  if (!isPasswordValid) {
    throw new AppError(
      401,
      "Invalid email/username or password."
    );
  }

  const token = generateAccessToken(user);
  return {
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user.id,
      displayName: user.displayName,
      username: user.username,
      email: user.email,
    },
  };
}

export async function getCurrentUser(
    userId: string
  ): Promise<AuthResponse["user"]> {
    const user = await findUserById(userId);

    if (!user) {
    throw new AppError(
        404,
        "User not found."
    );
    }
    return {
        id: user.id,
        displayName: user.displayName,
        username: user.username,
        email: user.email,
      };
  }


  export async function logoutUser() {
    return {
      success: true,
      message: "Logout successful",
    };
  }

  