import type { Request, Response, NextFunction } from "express";

import {
  getMyGetToKnowMeService,
  getUserGetToKnowMeService,
  upsertMyGetToKnowMeService,
} from "./getToKnowMe.service.js";

export async function getMyGetToKnowMe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getMyGetToKnowMeService(req.user!.userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getUserGetToKnowMe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getUserGetToKnowMeService(req.params.userId as string);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function upsertMyGetToKnowMe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await upsertMyGetToKnowMeService(
      req.user!.userId,
      req.body
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
