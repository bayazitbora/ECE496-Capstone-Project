import { TextField } from "@mui/material";
// import styles from "./Question.module.css";

function Question1({ formState, handleInputChange }) {
  return (
    <div>
      <h2>How should we call you?</h2>
      <div>
        <TextField
          id="name-input"
          label="First Name"
          variant="outlined"
          margin="normal"
          name="first_name"
          value={formState.first_name}
          onChange={handleInputChange}
        />
        <TextField
          id="name-input"
          label="Last Name"
          variant="outlined"
          margin="normal"
          name="last_name"
          value={formState.last_name}
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
    </div>
  );
}

export default Question1;
