import type { AxiosError } from "axios";
import api from "./api";
import type { ApiError } from "./apiError";
import type { PageParams, PageResponse } from "./defaultTypes";

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
  institutionId: string;
};

export type CreateStudentResponse = {
  id: string;
  message?: string;
};

export type Institution = {
  id: string;
  name: string;
};

export type FindAllStudentResponse = {
  institution: Institution;
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
  size: number = 10,
  q?: string,
): Promise<PageResponse<FindAllStudentResponse>> => {
  try {
    const params: PageParams = { page, size };

    if (q && q.trim() !== "") {
      params.q = q.trim();
    }

    const response = await api.get<PageResponse<FindAllStudentResponse>>(
      "/students",
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
