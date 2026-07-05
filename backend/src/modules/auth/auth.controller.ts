import type { Request, Response, NextFunction } from "express";

import { getCurrentUser, loginUser, registerUser } from "./auth.service.js";


export async function register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await registerUser(req.body);
  
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  export async function login(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await loginUser(req.body);
  
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  export async function me(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await getCurrentUser(
        req.user!.userId
      );
  
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  }