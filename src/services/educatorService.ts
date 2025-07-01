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
  coordinator: string;
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


export type Educator = {
  id: string;
  socialName: string;
};


export async function fetchEducators(
  input: string,
  institutionId: string
): Promise<Array<{ label: string; value: string }>> {
  try {
    const response = await api.get<{ content: Educator[] }>(
      `/educators/institution/${institutionId}`, {
        params: {
          q: input,
          page: 0,
          size: 10,
        },
      }
    );

    return response.data.content.map((educator) => ({
      label: educator.socialName,
      value: educator.id,
    }));
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Erro desconhecido ao buscar educadores.";
    console.error(message);
    return [];
  }
}