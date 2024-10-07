import styles from "./Question.module.css";
import {
  Question0,
  Question1,
  Question2,
  Question3,
  Question4,
  Question5,
  Question6,
  Question7,
  Question8,
  Question9,
  Question10,
  Question11,
} from "./Questions";

function QuestionTemplate({
  currentStep,
  nextStep,
  prevStep,
  signUpState,
  formState,
  handleSignUpInputChange,
  handleFormInputChange,
  handleSubmit,
  totalSteps,
}) {
  const renderQuestion = () => {
    switch (currentStep) {
      case 1:
        return (
          <Question0
            formState={signUpState}
            handleInputChange={handleSignUpInputChange}
          />
        );
      case 2:
        return (
          <Question1
            formState={signUpState}
            handleInputChange={handleSignUpInputChange}
          />
        );
      case 3:
        return (
          <Question2
            formState={signUpState}
            handleInputChange={handleSignUpInputChange}
          />
        );
      case 4:
        return <Question3 />;
      case 5:
        return (
          <Question4
            formState={formState}
            handleInputChange={handleFormInputChange}
          />
        );
      case 6:
        return (
          <Question5
            formState={formState}
            handleInputChange={handleFormInputChange}
          />
        );
      case 7:
        return (
          <Question6
            formState={formState}
            handleInputChange={handleFormInputChange}
          />
        );
      case 8:
        return (
          <Question7
            formState={formState}
            handleInputChange={handleFormInputChange}
          />
        );
      case 9:
        return (
          <Question8
            formState={formState}
            handleInputChange={handleFormInputChange}
          />
        );
      case 10:
        return (
          <Question9
            formState={formState}
            handleInputChange={handleFormInputChange}
          />
        );
      case 11:
        return (
          <Question10
            formState={formState}
            handleInputChange={handleFormInputChange}
          />
        );
      case 12:
        return (
          <Question11
            formState={formState}
            handleInputChange={handleFormInputChange}
          />
        );
      default:
        return (
          <Question0
            formState={formState}
            handleInputChange={handleFormInputChange}
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
