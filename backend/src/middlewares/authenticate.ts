import type {
    Request,
    Response,
    NextFunction,
  } from "express";
  
  import { AppError } from "../errors/AppError.js";
  import { verifyAccessToken } from "../lib/jwt.js";
  
  export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError(
        401,
        "Authentication token is missing."
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        throw new AppError(
          401,
          "Invalid authentication token."
        );
      }

      try {
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
      } catch (error) {
        throw new AppError(
          401,
          "Invalid or expired authentication token."
        );
      }
  }