import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { SignUpContext } from "../context/SignUpContext";
import { registerUser } from "../api/api";
import "./Input.css";

function SignUp() {
  const { setFormData } = useContext(SignUpContext);
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submit button clicked");
    setFormData(formState);
    navigate("/questionnaire");

    //   try {
    //     const data = await registerUser(formState);
    //     console.log("Registration successful:", data);
    //     navigate("/questionnaire");
    //   } catch (error) {
    //     setError("Failed to register user. Please try again.");
    //     console.error("Registration error:", error);
    //   }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // to remove later
        width: "100vw", // to remove later>
      }}
    >
      <h2>Create Your Account</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>
          <TextField
            id="name-input"
            label="First Name"
            variant="outlined"
            margin="normal"
            name="firstName"
            value={formState.firstName}
            onChange={handleInputChange}
          />
          <TextField
            id="name-input"
            label="Last Name"
            variant="outlined"
            margin="normal"
            name="lastName"
            value={formState.lastName}
            onChange={handleInputChange}
          />
        </div>
        <TextField
          id="standard-input"
          label="Username"
          variant="outlined"
          margin="normal"
          name="username"
          value={formState.username}
          onChange={handleInputChange}
        />
        <TextField
          id="standard-input"
          label="E-mail address"
          variant="outlined"
          margin="normal"
          name="email"
          value={formState.email}
          onChange={handleInputChange}
        />
        <TextField
          id="standard-input"
          label="Re-type your e-mail address"
          variant="outlined"
          margin="normal"
          name="confirmEmail"
        />
        <TextField
          id="standard-input"
          label="Password"
          variant="outlined"
          margin="normal"
          name="password"
          value={formState.password}
          onChange={handleInputChange}
        />
        <TextField
          id="standard-input"
          label="Re-type your password"
          variant="outlined"
          margin="normal"
          name="confirmPassword"
        />
        <Button
          id="standard-button"
          variant="contained"
          size="large"
          type="submit"
        >
          Sign Up
        </Button>
      </form>
    </div>
  );
}

export default SignUp;
