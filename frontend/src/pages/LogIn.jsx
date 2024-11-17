import { Input, Button, Form, FormGroup, Container } from "reactstrap";
import { useState, useEffect } from "react";
import { loginUser } from "../api/api";
import "./Input.css";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    console.log("LogIn component mounted"); // Debugging statement
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked"); // Debugging statement
    console.log("Email:", email);
    console.log("Password:", password);
    try {
      const data = await loginUser({ email, password });
      console.log("Login successful:", data);
      // Handle successful login (e.g., store token, redirect)
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

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
        <Form onSubmit={handleSubmit}>
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
          <Button color="primary" size="lg" type="submit">
            Log In
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default LogIn;
