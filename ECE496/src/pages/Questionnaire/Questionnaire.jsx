import { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
import styles from "./Questionnaire.module.css";

import ProgressBar from "../../components/Questionnaire/ProgressBar";
import QuestionTemplate from "../../components/Questionnaire/QuestionTemplate";
import { SignUpContext } from "../../context/SignUpContext";

function Questionnaire() {
  const { setFormData } = useContext(SignUpContext);
  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });
  // const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 9;

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
    // navigate("/questionnaire"); // TODO: change this
  };

  const handleInputChange = (event) => {
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
        formState={formState}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default Questionnaire;
