import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AccountCreation.module.css";

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

  const [formState, setFormState] = useState({
    course: "",
    project_interests: [],
    availability: [],
    meeting_frequency: "",
    skills: [],
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
    setFormData(formState);
    console.log(formState);
    navigate("/profile");
  };

  const handleSignUpInputChange = (event) => {
    const { name, value } = event.target;
    setSignUpState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
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
