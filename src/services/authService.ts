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

export interface PasswordRecovery {
  email: string;
  message: string;
}

export type PasswordRecoverRequest = {
  token: string;
  password: string;
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

export const requestPasswordRecovery = async (
  identifier: string
): Promise<PasswordRecovery> => {
  const response = await api.post<PasswordRecovery>('/auth/generate-password-recovery', {
    identifier, 
  });
  return response.data;
};


export const recoverPassword = async (data: PasswordRecoverRequest): Promise<void> => {
  await api.post('/auth/password-recovery', data);
};