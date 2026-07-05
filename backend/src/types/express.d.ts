import "express";

export interface JwtPayload {
  userId: string;
  username: string;
  email: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}