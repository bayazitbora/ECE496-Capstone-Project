import { TextField } from "@mui/material";
// import styles from "./Question.module.css";

function Question1({ formState, handleInputChange }) {
  return (
    <div>
      <h2>Welcome!</h2>
      <text>In order to find you a team, we need to learn more about you.</text>
      <br />
      <text>Answer a few questions to get started.</text>
      <br />
      <text>You will be able to modify your answers later.</text>
      <br />
      <text>Let us create your Account. </text>
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
