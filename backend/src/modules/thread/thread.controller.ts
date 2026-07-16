import { type Request, type Response } from "express";

import {
  createThreadService,
  getAllThreadsService,
  getThreadByIdService,
  createReplyService,
  reactToThreadService,
  resolveThreadService,
  deleteThreadService,
} from "./thread.service.js";


export async function createThread(
    req: Request,
    res: Response
  ) {
    const result = await createThreadService(
      req.user?.userId as string,
      req.body
    );

    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    res.status(201).json(result);
  }

  export async function getAllThreads(
    req: Request,
    res: Response
  ) {
    const result = await getAllThreadsService();
  
    res.json(result);
  }

  export async function getThreadById(
    req: Request,
    res: Response
  ) {
    const result = await getThreadByIdService(
      req.params.threadId as string
    );
  
    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    res.json(result);
  }

  export async function createReply(
    req: Request,
    res: Response
  ) {
    const result = await createReplyService(
      req.params.threadId as string,
      req.user?.userId as string,
      req.body
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.status(201).json(result);
  }
  
  export async function reactToThread(
    req: Request,
    res: Response
  ) {
    const result = await reactToThreadService(
      req.params.threadId as string,
      req.user?.userId as string,
      req.body
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.status(201).json(result);
  }

  export async function resolveThread(
    req: Request,
    res: Response
  ) {
    const result = await resolveThreadService(
      req.params.threadId as string,
      req.user?.userId as string,
      req.body
    );
    
    res.json(result);
  }

  export async function deleteThread(
    req: Request,
    res: Response
  ) {
    const result = await deleteThreadService(
      req.params.threadId as string,
      req.user?.userId as string
    );
  
    res.json(result);
  }