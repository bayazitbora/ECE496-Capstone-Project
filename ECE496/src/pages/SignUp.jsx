import { useState, useContext } from "react";
import { TextField, Button } from "@mui/material";
// import { signUpContext } from "../context/SignUpContext";
import "./Input.css";

function SignUp() {
  // const { setFormData } = useContext(signUpContext);

  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // setFormData(formState);
    console.log("Submitted form data:", formState);
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
          label="E-mail address"
          variant="outlined"
          margin="normal"
        />
        <TextField
          id="standard-input"
          label="Re-type your e-mail address"
          variant="outlined"
          margin="normal"
          name="email"
          value={formState.email}
          onChange={handleInputChange}
        />
        <TextField
          id="standard-input"
          label="Password"
          variant="outlined"
          margin="normal"
        />
        <TextField
          id="standard-input"
          label="Re-type your password"
          variant="outlined"
          margin="normal"
          name="password"
          value={formState.password}
          onChange={handleInputChange}
        />
        <Button id="standard-button" variant="contained" size="large">
          Sign Up
        </Button>
      </form>
    </div>
  );
}

export default SignUp;
