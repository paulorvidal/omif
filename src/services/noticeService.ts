import type { AxiosError } from "axios";
import api from "./api";
import type { ApiError } from "./apiError";

export type CreateNoticeRequest = {
  title: string;
  content: string;
  deliveryMethod: string;
  recipient: string;
};

type CreateNoticeResponse = {
  message: string;
};

export const createNotice = async (data: CreateNoticeRequest): Promise<CreateNoticeResponse> => {
  try {
    const response = await api.post<CreateNoticeResponse>("/notices", data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;

    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Erro inesperado. Aguarde ou tente novamente.";

    throw new Error(message);
  }
};
