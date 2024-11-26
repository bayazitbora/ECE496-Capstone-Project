// API functions for the frontend

// curl -X POST http://localhost:8000/api/register/ \
//   -H "Content-Type: application/json" \
//   -d '{"first_name": "Adrien", "last_name": "Mery", "username": "test12", "email": "test@example.com", "password": "password123", "pos": "ECE", "minors": "minor", "grad_year": "2025", "gpa": 3.0}'

export const registerUser = async (formData) => {
  const url = "http://localhost:8000/api/register/";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};


// curl -X POST http://localhost:8000/api/token/ \
//   -H "Content-Type: application/json" \
//   -d '{
//     "username": "guest",
//     "email": "adrien.mery@mail.utoronto.ca",
//     "password": "12345"
//   }'

export const loginUser = async (credentials) => {
  const url = "http://localhost:8000/api/token/";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Failed to log in", errorText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};


export const getUser = async ({ requested_user }, token) => {
  const url = "http://localhost:8000/api/getUser/";

  console.log("getUser");
  console.log("Token:", token);
  console.log("Username:", requested_user);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ requested_user }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch user details:", errorText);
      throw new Error("Failed to fetch user details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getSelf = async ({ username }, token) => {
  const url = "http://localhost:8000/api/getSelf/";

  console.log("getSelf called");
  console.log("Token:", token);
  console.log("Username:", username);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch self details:", errorText);
      throw new Error("Failed to fetch self details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createProfile = async (username, formState, token) => {
  const url = "http://localhost:8000/api/updateProfile/";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        username,
        profile: formState,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to create profile:", errorText);
      throw new Error("Failed to create profile");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// // Get the routes
// const getRoutes = async () => {
//   try {
//     const response = await fetch("http://localhost:8000/api/");
//     if (!response.ok) {
//       // Handle HTTP errors
//       console.error(`Error: ${response.status} ${response.statusText}`);
//       return;
//     }

//     const data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error("Error fetching routes:", error);
//   }
// };

// const getStatus = async () => {
//   try {
//     const response = await fetch("http://localhost:8000/api/getStatus/");
//     const status = await response.text(); // Since this returns a number
//     console.log("Status:", status);
//   } catch (error) {
//     console.error("Error fetching status:", error);
//   }
// };

// getRoutes();
// getStatus();
