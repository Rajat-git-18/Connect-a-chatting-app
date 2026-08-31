import { type Request, type Response } from "express";

import {
  getMyProfileService,
  updateMyProfileService,
  getUserProfileService,
} from "./user.service.js";

export async function getMyProfile(
  req: Request,
  res: Response
) {
  const result = await getMyProfileService(
    req.user?.userId as string
  );

  res.json(result);
}

export async function updateMyProfile(
  req: Request,
  res: Response
) {
  const result = await updateMyProfileService(
    req.user?.userId as string,
    req.body
  );

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.message,
    });
  }

  res.json(result);
}

export async function getUserProfile(
    req: Request,
    res: Response
  ) {
    const result = await getUserProfileService(
      req.params.userId as string
    );
  
    res.json(result);
  }