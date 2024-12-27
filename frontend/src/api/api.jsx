import axios from "axios";

// API functions for the frontend

/**
 * Registers a new user.
 * @param {Object} formData - The registration data.
 * @returns {Object} - The response data.
 */
export const registerUser = async (formData) => {
  const url = "http://localhost:8000/api/register/";

  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Logs in a user.
 * @param {Object} credentials - The login credentials.
 * @returns {Object} - The response data.
 */
export const loginUser = async (credentials) => {
  const url = "http://localhost:8000/api/token/";
  try {
    const response = await axios.post(url, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Refreshes the authentication token.
 * @param {string} refreshToken - The refresh token.
 * @returns {Object} - The response data.
 */
export const refreshToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/token/refresh/",
      { refresh: refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

/**
 * Fetches user details.
 * @param {Object} param0 - The requested user details.
 * @param {string} token - The authentication token.
 * @returns {Object} - The response data.
 */
export const getUser = async ({ requested_user }, token) => {
  const url = "http://localhost:8000/api/getUser/";

  console.log("getUser");
  console.log("Token:", token);
  console.log("Username:", requested_user);

  try {
    const response = await axios.post(
      url,
      { requested_user },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Fetches self details.
 * @param {Object} param0 - The username.
 * @param {string} token - The authentication token.
 * @returns {Object} - The response data.
 */
export const getSelf = async ({ username }, token) => {
  const url = "http://localhost:8000/api/getSelf/";

  console.log("getSelf called");
  console.log("Token:", token);
  console.log("Username:", username);

  try {
    const response = await axios.post(
      url,
      { username },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Creates or updates a user profile.
 * @param {string} username - The username.
 * @param {Object} formState - The profile data.
 * @param {string} token - The authentication token.
 * @returns {Object} - The response data.
 */
export const createProfile = async (username, formState, token) => {
  const url = "http://localhost:8000/api/updateProfile/";

  try {
    const response = await axios.post(
      url,
      {
        username,
        profile: formState,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Fetches the available routes.
 */
export const getRoutes = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/");
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching routes:", error);
  }
};

/**
 * Fetches the status.
 */
export const getStatus = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/getStatus/");
    console.log("Status:", response.data);
  } catch (error) {
    console.error("Error fetching status:", error);
  }
};
