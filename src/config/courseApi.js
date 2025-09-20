// src/api/courseApi.js
import axios from "axios";

// Replace with your backend URL
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Helper function to attach token to headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // or wherever you store your token
  return { Authorization: `Bearer ${token}` };
};

// Get all courses
export const getCourses = async () => {
  const response = await API.get("/courses", { headers: getAuthHeaders() });
  return response.data;
};

// Create a new course
export const createCourse = async (courseData) => {
  const response = await API.post("/courses", courseData, { headers: getAuthHeaders() });
  return response.data;
};

// Update a course
export const updateCourse = async (id, courseData) => {
  const response = await API.put(`/courses/${id}`, courseData, { headers: getAuthHeaders() });
  return response.data;
};

// Delete a course
export const deleteCourses = async (id) => {
  const response = await API.delete(`/courses/${id}`, { headers: getAuthHeaders() });
  return response.data;
};
