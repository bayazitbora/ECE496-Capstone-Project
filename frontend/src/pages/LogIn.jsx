import { Input, Button, Form, FormGroup, Label } from "reactstrap";
import "./Input.css";

function LogIn() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>Log In to your Account</h2>
      <Form>
        <FormGroup>
          <Label for="email">E-mail address</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
          />
        </FormGroup>
        <Button color="primary" size="lg">
          Log In
        </Button>
      </Form>
    </div>
  );
}

export default LogIn;
