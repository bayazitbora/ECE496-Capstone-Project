// API functions for the frontend

// curl -X POST http://localhost:8000/api/register/ \
//   -H "Content-Type: application/json" \
//   -d '{"first_name": "Adrien", "last_name": "Mery", "username": "test12", "email": "test@example.com", "password": "password123", "pos": "ECE", "minors": "minor", "grad_year": "2025", "gpa": 3.0}'

export const registerUser = async (formData) => {
  const url = "http://localhost:8000/api/register/";

  // Ensure gpa is a number, not a string in formData
  const cleanedFormData = {
    ...formData,
    gpa: parseFloat(formData.gpa), // Convert gpa to a number
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanedFormData),
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
  console.log("loginUser called with credentials:", credentials); // Debugging statement

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
      console.error("Failed to log in:", errorText); // Debugging statement
      throw new Error("Failed to log in");
    }

    const data = await response.json();
    console.log("loginUser response data:", data); // Debugging statement
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
