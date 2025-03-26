import axios from "axios";

// Define the API base URL based on environment
const getBaseUrl = () => {
  // If we're in production (Render deployment)
  if (import.meta.env.PROD) {
    // Use the Render backend service URL
    return "https://backend-nfdh.onrender.com/api/";
  }
  // For local development
  return "http://localhost:8000/api/";
};

const API_BASE_URL = getBaseUrl();

// Public axios instance
export const publicAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,  // Important for CORS with credentials
});

// Private axios instance
export const privateAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,  // Important for CORS with credentials
});

// Function to set the token for private axios instance
export const setPrivateAxiosToken = (token) => {
  privateAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
