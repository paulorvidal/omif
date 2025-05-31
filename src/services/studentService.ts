import api from "./api";

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

export const createStudent = async (
  data: CreateStudentRequest,
): Promise<CreateStudentResponse> => {
  const response = await api.post("/students", data);
  return response.data;
};
