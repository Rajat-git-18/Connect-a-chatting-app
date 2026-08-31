export interface GetToKnowMeData {
  id: string;
  title: string;
  question: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpsertGetToKnowMeRequest {
  question: string;
}

export interface GetToKnowMeResponseBody {
  success: boolean;
  message: string;
  data: {
    id: string;
    title: string;
    question: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}
