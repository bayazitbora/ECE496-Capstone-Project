// API functions for the frontend

export const registerUser = async (formData) => {
  const url = "http://142.116.182.108:2003/api/register/";
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

// Get the routes
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
