import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AccountCreation.module.css";
import { registerUser } from "../../api/api";

import ProgressBar from "../../components/AccountCreation/ProgressBar";
import QuestionTemplate from "../../components/AccountCreation/AccountCreationTemplate";
import { SignUpContext } from "../../context/SignUpContext";

function AccountCreation() {
  const { setFormData } = useContext(SignUpContext);
  const [signUpState, setSignUpState] = useState({
    role: "", // student or instructor
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    pos: "", // prgm of study
    grad_year: "", // expected grad year
    minors: [], // array of minors
    gpa: 0, // 0-4
  });

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submit button clicked");
    setFormData(signUpState);
    try {
      const response = await registerUser(signUpState);
      console.log("User registered:", response);
    } catch (error) {
      console.error("Registration failed:", error);
    }
    navigate("/profile");
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
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <QuestionTemplate
        currentStep={currentStep}
        totalSteps={totalSteps}
        nextStep={nextStep}
        prevStep={prevStep}
        signUpState={signUpState}
        handleSignUpInputChange={handleSignUpInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default AccountCreation;
