import api from "./api";

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post("/auth", data);
  return response.data;
};
