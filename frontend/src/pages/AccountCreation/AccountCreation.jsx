import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AccountCreation.module.css";
import { publicAxios, privateAxios, setPrivateAxiosToken } from "../../api/api";

import AccountCreationForm from "../../components/AccountCreation/AccountCreationForm";
import { SignUpContext } from "../../context/SignUpContext";
import { useAuth } from "../../context/AuthContext";
import { Alert } from "reactstrap";

/**
 * AccountCreation component handles user registration functionality.
 * It sends registration data to the server, logs in the user, and fetches user data upon successful registration.
 */
function AccountCreation() {
  const { setFormData } = useContext(SignUpContext);
  const { setToken } = useAuth();
  const [signUpState, setSignUpState] = useState({
    teacher: "False", // student or instructor
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    pos: "", // program of study
    grad_year: null, // expected graduation year
    minors: [], // array of minors
    gpa: 0.0, // 0-4
  });
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  /**
   * Handles the form submission for account creation.
   * Sends the registration data to the server, logs in the user, and fetches user data.
   * @param {Event} event - The form submission event.
   */
  const handleSubmit = async () => {
    // Check if passwords match
    if (signUpState.password !== signUpState.confirmPassword) {
      setAlertMessage("Passwords do not match.");
      return;
    }

    // Separate last_name into first_name and last_name
    const nameParts = signUpState.last_name.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ");
    console.log("First name:", first_name);
    console.log("Last name:", last_name);

    try {
      // Register user
      console.log("Registering user:", signUpState);
      const registerResponse = await publicAxios.post("register/", {
        ...signUpState,
        first_name,
        last_name,
      });
      console.log("User registered:", registerResponse.data);

      // Log in user
      const loginResponse = await publicAxios.post("token/", {
        username: signUpState.username,
        password: signUpState.password,
      });
      const loginData = loginResponse.data;
      if (!loginData.access) {
        throw new Error("Failed to receive access token");
      }
      setToken(loginData.access);
      setPrivateAxiosToken(loginData.access);

      // Fetch user data
      const userResponse = await privateAxios.post("getSelf/", {
        username: signUpState.username,
      });
      const userData = userResponse.data;

      setFormData({
        teacher: userData.teacher,
        title: userData.title,
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        email: signUpState.email,
        pos: userData.pos,
        grad_year: userData.grad_year,
        minors: userData.minors,
        gpa: userData.GPA,
      });
      console.log("User data:", userData);

      // Navigate to profile after setting user data
      navigate("/profile");
      window.location.reload();
    } catch (error) {
      setAlertMessage("Submission failed. Please try again.");
      if (error.response) {
        if (error.response.status === 400) {
          console.error("Registration failed:", error.response.data);
        } else if (error.response.status === 401) {
          console.error("Login failed:", error.response.data);
        } else {
          console.error("Fetching user data failed:", error.response.data);
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  /**
   * Handles the cancel action and navigates to the home page.
   */
  const handleCancel = () => {
    navigate("/");
  };

  /**
   * Handles input changes for the sign-up form.
   * @param {Event} event - The input change event.
   */
  const handleSignUpInputChange = (event) => {
    const { name, value } = event.target;
    setSignUpState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className={styles.QuestionnaireContainer}>
      {alertMessage && (
        <Alert color="danger" fade={false}>
          {alertMessage}
        </Alert>
      )}
      <AccountCreationForm
        signUpState={signUpState}
        handleSignUpInputChange={handleSignUpInputChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </div>
  );
}

export default AccountCreation;
