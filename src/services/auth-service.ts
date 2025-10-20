import api from "./api";
import type {
  LoginRequest,
  LoginResponse,
  PasswordRecoverRequest,
  PasswordRecovery,
} from "../types/auth-types";
import type { AxiosResponse } from "axios";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth", data);
  return response.data;
};

export const resendVerificationLink = (email: string) => {
  return api.post("/auth/resend-verification-link", { email });
};

export const verifyEmail = (token: string) => {
  return api.get("/auth/verify-email", {
    params: {
      token,
    },
  });
};

export const requestPasswordRecovery = async (
  identifier: string,
): Promise<PasswordRecovery> => {
  const response = await api.post<PasswordRecovery>(
    "/auth/generate-password-recovery",
    {
      identifier,
    },
  );
  return response.data;
};

export const validateRecoveryToken = async (
  token: string,
): Promise<AxiosResponse> => {
  return api.get(`/auth/password-recovery/${token}`);
};

export const recoverPassword = async (
  data: PasswordRecoverRequest,
): Promise<void> => {
  await api.post("/auth/password-recovery", data);
};
