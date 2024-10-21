import styles from "./Question.module.css";
import {
  RoleQ,
  NameQ,
  AccountQ,
  MajorQ,
  MinorQ,
  GPAQ,
  MessageQ,
} from "./AccountQuestions";

function AccountCreationTemplate({
  currentStep,
  nextStep,
  prevStep,
  signUpState,
  handleSignUpInputChange,
  handleSubmit,
  totalSteps,
}) {
  const renderQuestion = () => {
    switch (currentStep) {
      case 1:
        return (
          <RoleQ
            formState={signUpState}
            handleInputChange={handleSignUpInputChange}
          />
        );
      case 2:
        return (
          <NameQ
            formState={signUpState}
            handleInputChange={handleSignUpInputChange}
          />
        );
      case 3:
        return (
          <AccountQ
            formState={signUpState}
            handleInputChange={handleSignUpInputChange}
          />
        );
      case 4:
        return (
          <MajorQ
            formState={signUpState}
            handleInputChange={handleSignUpInputChange}
          />
        );
      case 5:
        return (
          <MinorQ
            formState={signUpState}
            handleInputChange={handleSignUpInputChange}
          />
        );
      case 6:
        return (
          <GPAQ
            formState={signUpState}
            handleInputChange={handleSignUpInputChange}
          />
        );
      case 7:
        return (
          <MessageQ
            formState={signUpState}
            handleInputChange={handleSignUpInputChange}
          />
        );
      default:
        return (
          <RoleQ
            formState={signUpState}
            handleInputChange={handleSignUpInputChange}
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

export default AccountCreationTemplate;
