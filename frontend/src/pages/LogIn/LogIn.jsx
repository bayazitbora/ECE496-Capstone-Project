import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { publicAxios, privateAxios, setPrivateAxiosToken } from "../../api/api";
import { Container, Button, Form, FormGroup, Input } from "reactstrap";
import "./LogIn.module.css";
import { SignUpContext } from "../../context/SignUpContext";
import { useAuth } from "../../context/AuthContext";

/**
 * LogIn component handles user login functionality.
 * It sends login credentials to the server and fetches user data upon successful login.
 */
function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setFormData } = useContext(SignUpContext);
  const { token, setToken, setRefreshToken } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * Handles the form submission for login.
   * Sends the login credentials to the server and sets the authentication tokens.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await publicAxios.post("token/", { username, password });
      const data = response.data;
      console.log("Login successful, token received:", data.access);
      setToken(data.access);
      setRefreshToken(data.refresh);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  /**
   * Fetches user data after successful login.
   * Sets the user data in the context and navigates to the profile page.
   */
  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoggedIn && token) {
        setPrivateAxiosToken(token);
        try {
          const response = await privateAxios.post("getSelf/", { username });
          const userData = response.data;
          setFormData({
            role: userData.teacher ? "instructor" : "student",
            first_name: userData.first_name,
            last_name: userData.last_name,
            username: userData.username,
            email: userData.email,
            pos: userData.pos,
            grad_year: userData.grad_year,
            minors: userData.minors,
            gpa: userData.GPA,
          });
          navigate("/profile");
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, [isLoggedIn, token, username, setFormData, navigate]);

  return (
    <Container>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2>Log In to your Account</h2>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <FormGroup>
            <Input
              type="username"
              name="username"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
          <Button type="submit">Log In</Button>
        </Form>
      </div>
    </Container>
  );
}

export default LogIn;
