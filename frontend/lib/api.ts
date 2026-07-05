import axios from "axios";

const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fd_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,  // ← back to original
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("fd_token");
      localStorage.removeItem("fd_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;