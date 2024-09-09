import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "./Start.css";

function Start() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // to remove later
        width: "100vw", // to remove later
      }}
    >
      <Stack spacing={2} direction="row">
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/questionnaire")}
        >
          Sign Up
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate("/log-in")}
        >
          Log In
        </Button>
      </Stack>
    </div>
  );
}

export default Start;
