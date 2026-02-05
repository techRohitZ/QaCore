import axios from "axios";

// 1. Create a Base Instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor (Automatically injects the JWT token)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor (Global Error Handling)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Pro Tip: If the backend returns 401, the token is expired/invalid
    if (error.response?.status === 401) {
      console.warn("Unauthorized: Clearing session...");
      localStorage.removeItem("token");
      // window.location.href = "/login"; // Optional: Force redirect
    }
    return Promise.reject(error);
  }
);

// --- PROJECT ENDPOINTS ---

export const getProjects = () => API.get("/projects");

export const getProjectById = (id) => API.get(`/projects/${id}`);

export const createProject = (projectData) => API.post("/projects", projectData);

export const deleteProject = (id) => API.delete(`/projects/${id}`);

// --- TEST EXECUTION ENDPOINTS ---

export const runProjectSuite = (projectId) => 
  API.post(`/projects/${projectId}/run`, {});

export const getProjectRuns = (projectId, params = {}) => 
  API.get(`/projects/${projectId}/runs`, { params });

// Add this new function
// Add this to the existing exports
export const getProjectSuites = (projectId) => API.get(`/testcases/project/${projectId}`);
export default API;

// import axios from "axios";

// // Configuration
// // Pro Tip: In production, use import.meta.env.VITE_API_URL
// const API_URL = "http://localhost:5000/api"; 

// // Helper: Standardized Headers
// const getAuthOptions = () => {
//   const token = localStorage.getItem("token");
//   return { 
//     headers: { 
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json"
//     } 
//   };
// };

// // --- CORE PROJECT ENDPOINTS ---

// /**
//  * Fetch all projects for the dropdown/list
//  */
// export const getProjects = async () => {
//   return axios.get(`${API_URL}/projects`, getAuthOptions());
// };

// /**
//  * Fetch a single project details (Test Cases, Config, etc.)
//  */
// export const getProjectById = async (id) => {
//   return axios.get(`${API_URL}/projects/${id}`, getAuthOptions());
// };

// /**
//  * Create a new Project
//  * @param {Object} projectData - { name, url }
//  */
// export const createProject = async (projectData) => {
//   return axios.post(`${API_URL}/projects`, projectData, getAuthOptions());
// };

// /**
//  * Delete a project
//  */
// export const deleteProject = async (id) => {
//   return axios.delete(`${API_URL}/projects/${id}`, getAuthOptions());
// };

// // --- TEST EXECUTION ENDPOINTS ---

// /**
//  * ✅ NEW: Trigger the Backend Test Runner
//  * Triggers POST /api/projects/:id/run
//  */
// export const runProjectSuite = async (projectId) => {
//   return axios.post(`${API_URL}/projects/${projectId}/run`, {}, getAuthOptions());
// };

// /**
//  * ✅ NEW: Get Execution History
//  * Triggers GET /api/projects/:id/runs
//  */
// export const getProjectRuns = async (projectId, params = {}) => {
//   // Params can be { page: 1, limit: 10, status: 'failed' }
//   return axios.get(`${API_URL}/projects/${projectId}/runs`, {
//     ...getAuthOptions(),
//     params: params 
//   });
// };