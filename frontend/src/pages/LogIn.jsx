import { TextField, Button } from "@mui/material";
import "./Input.css";

function LogIn() {
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
      <h2>Log In to your Account</h2>
      <TextField
        id="standard-input"
        label="E-mail address"
        variant="outlined"
        margin="normal"
      />
      <TextField
        id="standard-input"
        label="Password"
        variant="outlined"
        margin="normal"
      />
      <Button
        id="standard-button"
        variant="outlined"
        size="large"
        // onClick={}
      >
        Log In
      </Button>
    </div>
  );
}

export default LogIn;
