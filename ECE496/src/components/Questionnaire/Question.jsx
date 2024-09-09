import styles from "./Question.module.css";

function Question({ currentStep, nextStep }) {
  const questions = [
    "What is your name?",
    "What is your age?",
    "Where are you from?",
    "What is your occupation?",
    "What are your hobbies?",
    "What is your favorite food?",
    "What is your favorite movie?",
    "Do you have any pets?",
  ];

  return (
    <div className={styles.question}>
      <div className={styles.questionContainer}>
        <h2>{questions[currentStep - 1]}</h2>
        <button onClick={nextStep} className={styles.confirmButton}>
          Confirm
        </button>
      </div>
    </div>
  );
}

export default Question;
