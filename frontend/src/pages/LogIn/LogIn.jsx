import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { publicAxios, privateAxios, setPrivateAxiosToken } from "../../api/api";
import { Button, Form, FormGroup, Input, Alert } from "reactstrap";
import styles from "./Login.module.css";
import { SignUpContext } from "../../context/SignUpContext";
import { useAuth } from "../../context/AuthContext";

/**
 * LogIn component handles user login functionality.
 * It sends login credentials to the server and fetches user data upon successful login.
 */
function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setFormData } = useContext(SignUpContext);
  const { token, setToken, setRefreshToken } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(""); // Add state for login error

  /**
   * Handles the form submission for login.
   * Sends the login credentials to the server and sets the authentication tokens.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!email) {
      setLoginError("Email field should not be empty.");
      return;
    }
    if (!password) {
      setLoginError("Password field should not be empty.");
      return;
    }

    // Extract username from email
    const username = email.split("@")[0];

    try {
      const response = await publicAxios.post("token/", { username, password });
      const data = response.data;
      console.log("Login successful, token received:", data.access);
      setToken(data.access);
      setRefreshToken(data.refresh);
      setIsLoggedIn(true);
      setLoginError(""); // Clear any previous error
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Login failed. Please check your email and password."); // Set error message
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
          const response = await privateAxios.post("getSelf/", {
            username: email.split("@")[0],
          });
          const userData = response.data;
          console.log("User data:", userData);
          setFormData({
            teacher: userData.teacher,
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
  }, [isLoggedIn, token, email, setFormData, navigate]);

  return (
    <div className={styles.QuestionnaireContainer}>
      <h2>Log In to your Account</h2>
      {loginError && (
        <Alert color="danger" fade={false}>
          {loginError}
        </Alert>
      )}
      <Form onSubmit={(e) => handleSubmit(e)}>
        <FormGroup>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
  );
}

export default LogIn;
