import api from "./api";

export type LoginRequest = {
  email: string;
  password: string;
  captchaToken: string;
};

type LoginResponse = {
  token: string;
  role: string;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth", data);
  return response.data;
};

export const resendVerificationLink = (email: string) => {
  return api.post('/auth/resend-verification-link', { email });
};

export const verifyEmail = (token: string) => {
  return api.get('/auth/verify-email', {
    params: {
      token,
    },
  });
};
