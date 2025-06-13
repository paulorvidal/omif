import type { AxiosError } from "axios";
import api from "./api";
import type { ApiError } from "./apiError";

export type CreateEducatorRequest = {
  name: string;
  socialName: string;
  cpf: string;
  gender: string;
  email: string;
  password: string;
  siape: string;
  institutionId: string;
};

export type CreateEducatorResponse = {
  id: string;
  message?: string;
};

export const createEducator = async (
  data: CreateEducatorRequest,
): Promise<CreateEducatorResponse> => {
  try {
    const response = await api.post("/educators", data);
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
