import type { Request, Response, NextFunction } from "express";

import { listMessagesQuerySchema } from "./conversation.schema.js";
import {
  createOrGetConversationService,
  getConversationService,
  listConversationsService,
  listMessagesService,
  markConversationReadService,
  sendMessageService,
} from "./conversation.service.js";
import { AppError } from "../../errors/AppError.js";

export async function listConversations(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await listConversationsService(req.user!.userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function createConversation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await createOrGetConversationService(
      req.user!.userId,
      req.body
    );
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getConversation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getConversationService(
      req.user!.userId,
      req.params.conversationId as string
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function listMessages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = listMessagesQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      throw new AppError(
        400,
        parsed.error.issues[0]?.message ?? "Invalid query parameters"
      );
    }

    const result = await listMessagesService(
      req.user!.userId,
      req.params.conversationId as string,
      parsed.data.cursor,
      parsed.data.limit
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function sendMessage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await sendMessageService(
      req.user!.userId,
      req.params.conversationId as string,
      req.body
    );
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function markConversationRead(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await markConversationReadService(
      req.user!.userId,
      req.params.conversationId as string
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
