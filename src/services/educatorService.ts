import api from "./api";

export type CreateEducatorRequest = {
  name: string;
  socialName: string;
  cpf: string;
  gender: string;
  email: string;
  password: string;
  siape: string;
};

export type CreateEducatorResponse = {
  id: string;
  message?: string;
};

export const createEducator = async (
  data: CreateEducatorRequest,
): Promise<CreateEducatorResponse> => {
  const response = await api.post("/educators", data);
  return response.data;
};
