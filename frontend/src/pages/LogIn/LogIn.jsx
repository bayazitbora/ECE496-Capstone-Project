import { Input, Button, Form, FormGroup } from "reactstrap";
import styles from "./Login.module.css";

function LogIn() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      className={styles.QuestionnaireContainer}
    >
      <h2>Log In to your Account</h2>
      <Form>
        <FormGroup>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
          />
        </FormGroup>
        <FormGroup>
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
