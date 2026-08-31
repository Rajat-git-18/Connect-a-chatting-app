import api from "./client";
import {
  GetToKnowMe,
  GetToKnowMeResponse,
  UpsertGetToKnowMeRequest,
} from "../../types/getToKnowMe.types";

export const getMyGetToKnowMe = async (): Promise<GetToKnowMe | null> => {
  const response = await api.get<GetToKnowMeResponse>("/get-to-know-me/me");
  return response.data.data;
};

export const getUserGetToKnowMe = async (
  userId: string
): Promise<GetToKnowMe | null> => {
  const response = await api.get<GetToKnowMeResponse>(
    `/get-to-know-me/user/${userId}`
  );
  return response.data.data;
};

export const upsertMyGetToKnowMe = async (
  data: UpsertGetToKnowMeRequest
): Promise<GetToKnowMe> => {
  const response = await api.put<GetToKnowMeResponse>(
    "/get-to-know-me/me",
    data
  );

  if (!response.data.data) {
    throw new Error("Failed to save connection question.");
  }

  return response.data.data;
};
