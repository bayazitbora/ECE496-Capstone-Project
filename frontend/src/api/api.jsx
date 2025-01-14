import axios from "axios";

// Public axios instance
export const publicAxios = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Private axios instance
export const privateAxios = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set the token for private axios instance
export const setPrivateAxiosToken = (token) => {
  privateAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
