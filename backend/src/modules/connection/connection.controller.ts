import type { Request, Response, NextFunction } from "express";

import {
  acceptConnectionRequestService,
  cancelConnectionRequestService,
  getConnectionStatusService,
  getConnectionSuggestionsService,
  getConnectionsService,
  getIncomingConnectionRequestsService,
  getOutgoingConnectionRequestsService,
  rejectConnectionRequestService,
  removeConnectionService,
  sendConnectionRequestService,
} from "./connection.service.js";

export async function getConnectionSuggestions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getConnectionSuggestionsService(req.user!.userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getConnections(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getConnectionsService(req.user!.userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getIncomingConnectionRequests(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getIncomingConnectionRequestsService(req.user!.userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getOutgoingConnectionRequests(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getOutgoingConnectionRequestsService(req.user!.userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getConnectionStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getConnectionStatusService(
      req.user!.userId,
      req.params.userId as string
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function sendConnectionRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await sendConnectionRequestService(
      req.user!.userId,
      req.body
    );
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function acceptConnectionRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await acceptConnectionRequestService(
      req.user!.userId,
      req.params.requestId as string
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function rejectConnectionRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await rejectConnectionRequestService(
      req.user!.userId,
      req.params.requestId as string
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function cancelConnectionRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await cancelConnectionRequestService(
      req.user!.userId,
      req.params.requestId as string
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function removeConnection(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await removeConnectionService(
      req.user!.userId,
      req.params.connectionId as string
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
