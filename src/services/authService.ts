import api from "./api";

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

export const login = async ({
  email,
  password,
}: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post("auth", { email, password });

  return response.data;
};
