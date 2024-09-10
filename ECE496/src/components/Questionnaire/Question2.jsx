import { TextField } from "@mui/material";

function Question2(formState, handleInputChange) {
  return (
    <div>
      <h2>Create your account</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
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
      </div>
    </div>
  );
}

export default Question2;
