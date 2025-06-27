import type { AxiosError } from "axios";
import api from "./api";
import type { ApiError } from "./apiError";

export type Institution = {
  id: string;
  name: string;
};

export type FindAllInstitutionsResponse = {
  id: string;
  inep: string;
  name: string;
  coordinatorName: string;
  email: string;
};

export type PageResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements?: number;
  size?: number;
  number?: number; 
};

export const findAllInstitutions = async (
  page: number,
  size: number = 10,
  q?: string,
): Promise<PageResponse<FindAllInstitutionsResponse>> => {
  try {
    const params: Record<string, any> = { page, size };
    if (q && q.trim() !== "") {
      params.q = q.trim();
    }
    const response = await api.get<PageResponse<FindAllInstitutionsResponse>>(
      "/institutions",
      { params },
    );
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

export async function fetchInstitutions(
  input: string
): Promise<Array<{ label: string; value: string }>> {
  try {
    const response = await api.get<{
      content: Institution[];
    }>("/institutions/search", {
      params: {
        q: input,
        page: 0,
        size: 10,
      },
    });

    return response.data.content.map((inst) => ({
      label: inst.name,
      value: inst.id,
    }));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiError>;
    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Erro desconhecido ao buscar instituições.";
    console.error(message);
    return [];
  }
}


export type CreateInstitutionRequest = {
  name: string;
  inep: string;
  email1: string;
  email2: string | undefined;
  email3: string | undefined;
  phoneNumber: string;
};

export type CreateInstitutionResponse = {
  id: string;
  message?: string;
};

export const createInstitution = async (
  data: CreateInstitutionRequest,
): Promise<CreateInstitutionResponse> => {
  try {
    const response = await api.post("/institutions", data);
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