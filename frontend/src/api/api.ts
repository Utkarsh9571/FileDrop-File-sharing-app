import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5500/api/v1",
});

// Attach token if present. Do not override Content-Type for FormData uploads.
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
