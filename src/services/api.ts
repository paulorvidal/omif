import axios from "axios";
import { redirectTo, showToast } from "../utils/events";

const apiUrl = "http://89.116.73.16:8080";

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
  (error) => {
    if (error.response?.status === 401) {
      if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
      }
      if (localStorage.getItem("role")) {
        localStorage.removeItem("role");
      }
      redirectTo("/login");
    }

    return Promise.reject(error);
  },
);

export default api;
