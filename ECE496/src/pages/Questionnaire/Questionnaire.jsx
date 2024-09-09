import { useState } from "react";
import styles from "./Questionnaire.module.css";

import ProgressBar from "../../components/Questionnaire/ProgressBar";
import Question from "../../components/Questionnaire/Question";

function Questionnaire() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 9;
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className={styles.QuestionnaireContainer}>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <Question currentStep={currentStep} nextStep={nextStep} />
    </div>
  );
}

export default Questionnaire;
