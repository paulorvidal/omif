import type { AxiosError } from "axios";
import api from "./api";
import type { ApiError } from "./apiError";

export type CreateStudentRequest = {
  email: string;
  password: string;
  name: string;
  motherName: string;
  birthDate: string;
  auxilioBrasil: string;
  grade: number;
  elementarySchoolCompletionPlace: string;
  incomeRange: string;
  ethnicity: string;
  socialName: string;
  cpf: string;
  gender: string;
};

export type CreateStudentResponse = {
  id: string;
  message?: string;
};

export type FindAllStudentResponse = {
  id: string;
  email: string;
  name: string;
  motherName: string;
  birthDate: string;
  auxilioBrasil: string;
  grade: number;
  elementarySchoolCompletionPlace: string;
  incomeRange: string;
  ethnicity: string;
  socialName: string;
  cpf: string;
  gender: string;
};

export const createStudent = async (
  data: CreateStudentRequest,
): Promise<CreateStudentResponse> => {
  try {
    const response = await api.post<CreateStudentResponse>("/students", data);
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

export const findAllStudents = async (
  page: number,
): Promise<FindAllStudentResponse[]> => {
  try {
    const response = await api.get<FindAllStudentResponse[]>("/students", {
      params: {
        page,
        size: 10,
      },
    });
    return response.data.content;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;

    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Erro inesperado. Aguarde ou tente novamente.";

    throw new Error(message);
  }
};
