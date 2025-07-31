import axios, { type AxiosError } from "axios";
import { redirectTo } from "../utils/events";
import { ApiError } from "./apiError";

//const apiUrl = "http://89.116.73.16:8080";
const apiUrl = "http://localhost:8080";


type BackendErrorResponse = {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  code?: string;
};

const api = axios.create({
  baseURL: apiUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<BackendErrorResponse>) => {
    const isLoginRequest = error.config?.url === "/auth";

    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      redirectTo("/login");

      return Promise.reject(
        new ApiError("Sessão expirada. Por favor, faça login novamente.", 401),
      );
    }

    if (error.isAxiosError && error.response) {
      const backendError = error.response.data;
      const message = backendError?.message || "Ocorreu um erro inesperado no servidor.";
      const statusCode = backendError?.status || 500;
      const code = backendError?.code;

      return Promise.reject(new ApiError(message, statusCode, code));
    }

    return Promise.reject(
      new ApiError(error.message || "Erro de conexão. Verifique sua rede.", 0),
    );
  },
);

export default api;
