import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import "./Start.css";

function Start() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        height: "100vh",
        paddingTop: "20vh",
      }}
    >
      <Button
        color="primary"
        size="lg"
        onClick={() => navigate("/sign-up")}
        style={{ marginRight: "20px" }}
      >
        Sign Up
      </Button>
      <Button
        color="secondary"
        size="lg"
        onClick={() => navigate("/log-in")}
      >
        Log In
      </Button>
    </div>
  );
}

export default Start;
