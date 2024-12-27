import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AccountCreation.module.css";
import { registerUser, loginUser, getSelf, refreshToken } from "../../api/api";

import AccountCreationForm from "../../components/AccountCreation/AccountCreationForm";
import { SignUpContext } from "../../context/SignUpContext";
import { useAuth } from "../../context/AuthContext";

function AccountCreation() {
  const { setFormData } = useContext(SignUpContext);
  const { token, setToken } = useAuth();
  const [signUpState, setSignUpState] = useState({
    role: "", // student or instructor
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    email: "",
    pos: "", // prgm of study
    grad_year: null, // expected grad year
    minors: [], // array of minors
    gpa: 0.0, // 0-4
  });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("form data:", signUpState);

    try {
      const response = await registerUser(signUpState);
      console.log("User registered:", response);

      const loginData = await loginUser({
        username: signUpState.username,
        password: signUpState.password,
      });

      if (!loginData.access) {
        throw new Error("Failed to receive access token");
      }

      setToken(loginData.access);
      let userData;
      try {
        userData = await getSelf(
          { username: signUpState.username },
          loginData.access
        );
      } catch (error) {
        if (error.response && error.response.status === 401) {
          const newToken = await refreshToken(loginData.refresh);
          if (!newToken.access) {
            throw new Error("Failed to refresh access token");
          }
          setToken(newToken.access);
          userData = await getSelf(
            { username: signUpState.username },
            newToken.access
          );
        } else {
          throw error;
        }
      }

      setFormData({
        role: userData.role,
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

      navigate("/profile");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleSignUpInputChange = (event) => {
    const { name, value } = event.target;
    setSignUpState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className={styles.QuestionnaireContainer}>
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
