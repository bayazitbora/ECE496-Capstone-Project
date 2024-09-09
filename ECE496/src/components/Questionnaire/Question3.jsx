import { TextField } from "@mui/material";

function Question3(formState, handleInputChange) {
  return (
    <div>
      <h2>Choose a strong password</h2>
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
    </div>
  );
}

export default Question3;
