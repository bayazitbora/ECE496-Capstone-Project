import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Questionnaire.module.css";

import ProgressBar from "../components/AccountCreation/ProgressBar";
import QuestionTemplate from "../components/AccountCreation/AccountCreationTemplate";
import { SignUpContext } from "../context/SignUpContext";

function Questionnaire() {
  const { setFormData } = useContext(SignUpContext);
  const [signUpState, setSignUpState] = useState({
    profile_type: "", // stu or instr profiles
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });
  const [formState, setFormState] = useState({
    project_interests: [],
    availability: [],
    meeting_frequency: "",
    gpa_range: "",
    major: "",
    minors: [],
    courses_taken: [],
    skills: [],
  });
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 12;

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
        formState={formState}
        handleSignUpInputChange={handleSignUpInputChange}
        handleFormInputChange={handleFormInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default Questionnaire;
