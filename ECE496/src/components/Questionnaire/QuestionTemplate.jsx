import styles from "./Question.module.css";
import Question1 from "./Question1";
import Question2 from "./Question2";
import Question3 from "./Question3";

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
        return (
          <Question3
            formState={formState}
            handleInputChange={handleInputChange}
          />
        );
      // case 4:
      //   return <Question4  />;
      // case 5:
      //   return <Question5 />;
      // case 6:
      //   return <Question6 />;
      // case 7:
      //   return <Question7 />;
      // case 8:
      //   return <Question8  />;
      // case 9:
      //   return <Question9  />;
      default:
        return <Question1 />;
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
        <div>
          {goBackButton(currentStep, prevStep)}{" "}
          {confirmButton(currentStep, totalSteps, nextStep, handleSubmit)}
        </div>
      </div>
    </div>
  );
}

export default QuestionTemplate;
