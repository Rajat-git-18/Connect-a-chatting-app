import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny } from "zod";

import { AppError } from "../errors/AppError.js";

export function validate(schema: ZodTypeAny) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(
          400,
          result.error.issues[0]?.message || "Invalid request data"
        )
      );
    }

    req.body = result.data;

    next();
  };
}