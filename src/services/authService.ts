import type { AxiosError } from "axios";
import api from "./api";
import type { ApiError } from "./apiError";

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/auth", data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;

    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Erro inesperado ao tentar fazer login";

    throw new Error(message);
  }
};
