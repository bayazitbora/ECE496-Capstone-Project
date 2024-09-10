import styles from "./Question.module.css";
import Question1 from "./Question1";
import Question2 from "./Question2";
import Question3 from "./Question3";
import Question4 from "./Question4";
import Question5 from "./Question5";
import Question6 from "./Question6";
import Question7 from "./Question7";
import Question8 from "./Question8";
import Question9 from "./Question9";
import Question10 from "./Question10";
import Question11 from "./Question11";

function QuestionTemplate({
  currentStep,
  nextStep,
  prevStep,
  formState,
  handleInputChange,
  handleSubmit,
  totalSteps,
}) {
  const renderQuestion = () => {
    switch (currentStep) {
      case 1:
        return (
          <Question1
            formState={formState}
            handleInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <Question2
            formState={formState}
            handleInputChange={handleInputChange}
          />
        );
      case 3:
        return <Question3 />;
      case 4:
        return (
          <Question4
            formState={formState}
            handleInputChange={handleInputChange}
          />
        );
      case 5:
        return (
          <Question5
            formState={formState}
            handleInputChange={handleInputChange}
          />
        );
      case 6:
        return (
          <Question6
            formState={formState}
            handleInputChange={handleInputChange}
          />
        );
      case 7:
        return (
          <Question7
            formState={formState}
            handleInputChange={handleInputChange}
          />
        );
      case 8:
        return (
          <Question8
            formState={formState}
            handleInputChange={handleInputChange}
          />
        );
      case 9:
        return (
          <Question9
            formState={formState}
            handleInputChange={handleInputChange}
          />
        );
      case 10:
        return (
          <Question10
            formState={formState}
            handleInputChange={handleInputChange}
          />
        );
      case 11:
        return (
          <Question11
            formState={formState}
            handleInputChange={handleInputChange}
          />
        );
      default:
        return (
          <Question1
            formState={formState}
            handleInputChange={handleInputChange}
          />
        );
    }
  };
  const goBackButton = (currentStep, prevStep) => {
    if (currentStep == 1) {
      return;
    } else {
      return (
        <button onClick={prevStep} className={styles.cancelButton}>
          Go Back
        </button>
      );
    }
  };

  const confirmButton = (currentStep, totalSteps, nextStep, handleSubmit) => {
    if (currentStep == totalSteps) {
      return (
        <button onClick={handleSubmit} className={styles.confirmButton}>
          Confirm
        </button>
      );
    }
    return (
      <button onClick={nextStep} className={styles.confirmButton}>
        Confirm
      </button>
    );
  };

  return (
    <div className={styles.question}>
      <div className={styles.questionContainer}>
        {renderQuestion()}
        <div className={styles.confirmCancelContainer}>
          {goBackButton(currentStep, prevStep)}{" "}
          {confirmButton(currentStep, totalSteps, nextStep, handleSubmit)}
        </div>
      </div>
    </div>
  );
}

export default QuestionTemplate;
