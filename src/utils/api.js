import axios from "axios";

// You can change this baseURL depending on your environment (localhost or deployed)
const API = axios.create({
  baseURL: "http://localhost:3002", // 🔁 adjust if needed for production
  withCredentials: true, // Required if you're using cookies for auth (optional)
});

// Attach token from localStorage (or wherever you store it) to each request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
