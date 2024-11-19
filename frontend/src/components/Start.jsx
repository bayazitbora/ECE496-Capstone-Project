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
        alignItems: "center",
      }}
    >
        <Button
          color="primary"
          size="lg"
          onClick={() => navigate("/sign-up")}
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
