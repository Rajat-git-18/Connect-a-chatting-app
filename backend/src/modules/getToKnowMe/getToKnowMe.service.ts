import { AppError } from "../../errors/AppError.js";
import { findUserById } from "../auth/auth.repository.js";
import { getToKnowMeRepository } from "./getToKnowMe.repository.js";
import type {
  GetToKnowMeResponseBody,
  UpsertGetToKnowMeRequest,
} from "./getToKnowMe.types.js";

function mapGetToKnowMe(record: {
  id: string;
  title: string;
  question: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: record.id,
    title: record.title,
    question: record.question,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export async function getMyGetToKnowMeService(
  userId: string
): Promise<GetToKnowMeResponseBody> {
  const record = await getToKnowMeRepository.getByUserId(userId);

  return {
    success: true,
    message: record
      ? "Connection question fetched successfully."
      : "No connection question set yet.",
    data: record ? mapGetToKnowMe(record) : null,
  };
}

export async function getUserGetToKnowMeService(
  userId: string
): Promise<GetToKnowMeResponseBody> {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  const record = await getToKnowMeRepository.getByUserId(userId);

  return {
    success: true,
    message: record
      ? "Connection question fetched successfully."
      : "This user has not set a connection question yet.",
    data: record ? mapGetToKnowMe(record) : null,
  };
}

export async function upsertMyGetToKnowMeService(
  userId: string,
  data: UpsertGetToKnowMeRequest
): Promise<GetToKnowMeResponseBody> {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  const record = await getToKnowMeRepository.upsert(
    userId,
    data.question.trim()
  );

  return {
    success: true,
    message: "Connection question saved successfully.",
    data: mapGetToKnowMe(record),
  };
}
