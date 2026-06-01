import axios from "axios";

const API_URL =
  "https://cfab-backend-c4oyaozbp-syed-haris-projects-930823a6.vercel.app";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

export default api;
