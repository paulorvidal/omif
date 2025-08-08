export type LoginRequest = {
  email: string;
  password: string;
  captchaToken: string;
};

export type LoginResponse = {
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