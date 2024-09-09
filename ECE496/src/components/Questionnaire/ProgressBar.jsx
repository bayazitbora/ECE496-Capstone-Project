import styles from "./ProgressBar.module.css";

function ProgressBar({ currentStep, totalSteps }) {
  const progress = currentStep / totalSteps;

  return (
    <div className={styles.progressBar}>
      <div
        className={styles.progressBarFill}
        style={{ width: `${progress * 100}%` }}
      ></div>
      <span>
        {currentStep} / {totalSteps}
      </span>
    </div>
  );
}

export default ProgressBar;
