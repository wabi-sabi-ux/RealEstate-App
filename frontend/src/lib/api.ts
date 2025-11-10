import axios from "axios";
import type { LoginCredentials } from "../types";

// Central axios instance for the app
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080",
  withCredentials: true, // harmless now; useful if you add cookies later
});

// Attach Basic Auth header from session storage (set during login)
api.interceptors.request.use((config) => {
  const email = sessionStorage.getItem("auth:email");
  const password = sessionStorage.getItem("auth:password");
  if (email && password) {
    const token = btoa(`${email}:${password}`);
    config.headers = config.headers || {};
    (config.headers as Record<string, string>).Authorization = `Basic ${token}`;
  }
  return config;
});

// Add auth interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (credentials: LoginCredentials) =>
    api.post("/users/login", null, {
      params: credentials,
      auth: {
        username: credentials.email,
        password: credentials.password,
      },
    }),
  logout: () => api.post("/users/logout"),
};

export const properties = {
  list: () => api.get("/properties"),
  getById: (id: string) => api.get(`/properties/${id}`),
  search: (params: any) => api.get("/properties/search", { params }),
};

export const brokers = {
  list: () => api.get("/brokers"),
  getById: (id: string) => api.get(`/brokers/${id}`),
  rate: (id: string, rating: number, comment: string) =>
    api.post(`/brokers/${id}/ratings`, { rating, comment }),
};

export default api;
