// const API_BASE = "http://localhost:5000/api"; // later replace with server IP/domain





// src/api.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";
export const APIS = {
  auth: {
    login: `${API_BASE}/auth/login`,
  },
  colleges: `${API_BASE}/colleges`,
  students: `${API_BASE}/students`,
  teachers: `${API_BASE}/teachers`,
  courses: `${API_BASE}/courses`,
  subjects: `${API_BASE}/subjects`,
  attendance: `${API_BASE}/attendance`,
  fees: `${API_BASE}/fees`,
  notifications: `${API_BASE}/notifications`,
  leaves: `${API_BASE}/leaves`,
  reports: `${API_BASE}/reports`,
  logs: `${API_BASE}/logs`,
};
const API = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const login = (payload) => API.post("/auth/login", payload);
export const registerSuper = (payload) => API.post("/auth/register-super", payload);

// Colleges
export const fetchColleges = () => API.get("/colleges");
export const addCollege = (payload) => API.post("/colleges", payload);
export const updateCollege = (id, payload) => API.put(`/colleges/${id}`, payload);
export const toggleCollege = (id) => API.patch(`/colleges/${id}/toggle`);
export const deleteCollege = (id) => API.delete(`/colleges/${id}`);

// Logs
export const fetchLogs = () => API.get("/logs");

// Generic helper for feature flags (we reuse updateCollege - send `features` object)
export const saveCollegeFeatures = (id, features) => API.put(`/colleges/${id}`, { features });

export default API;
