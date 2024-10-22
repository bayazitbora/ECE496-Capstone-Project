import {
  CourseNameQ,
  InterestsQ,
  FrequencyQ,
  SkillsQ,
  ThankYouQ,
} from "./AddCourseQuestions";
import AvailabilityQ from "./AvailabilityQ";

import styles from "./AddCourseTemplate.module.css";

function AddCourseTemplate({
  currentStep,
  nextStep,
  prevStep,
  formState,
  handleFormInputChange,
  handleSubmit,
  totalSteps,
}) {
  const renderQuestion = () => {
    switch (currentStep) {
      case 1:
        return (
          <CourseNameQ
            formState={formState}
            handleInputChange={handleFormInputChange}
          />
        );
      case 2:
        return (
          <InterestsQ
            formState={formState}
            handleInputChange={handleFormInputChange}
          />
        );
      case 3:
        return (
          <AvailabilityQ
            formState={formState}
            handleInputChange={handleFormInputChange}
          />
        );
      case 4:
        return (
          <FrequencyQ
            formState={formState}
            handleInputChange={handleFormInputChange}
          />
        );
      case 5:
        return (
          <SkillsQ
            formState={formState}
            handleInputChange={handleFormInputChange}
          />
        );
      case 6:
        return <ThankYouQ />;
      default:
        return (
          <CourseNameQ
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

export default AddCourseTemplate;
