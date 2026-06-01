import axios from "axios";

const API_URL = "https://cfab-backend.vercel.app";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

export default api;
