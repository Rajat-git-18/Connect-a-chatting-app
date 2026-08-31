export interface GetToKnowMe {
  id: string;
  title: string;
  question: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetToKnowMeResponse {
  success: boolean;
  message: string;
  data: GetToKnowMe | null;
}

export interface UpsertGetToKnowMeRequest {
  question: string;
}
