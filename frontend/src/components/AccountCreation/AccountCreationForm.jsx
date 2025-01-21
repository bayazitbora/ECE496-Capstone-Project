import {
  RoleQ,
  NameQ,
  AccountQ,
  MajorQ,
  MinorQ,
  GPAQ,
  MessageQ,
} from "./AccountQuestions";
import { Button } from "reactstrap";
import styles from "./AccountCreationTemplate.module.css";

function AccountCreationForm({
  signUpState,
  handleSignUpInputChange,
  handleSubmit,
  handleCancel,
}) {
  const goBackButton = () => {
    return (
      <Button onClick={handleCancel} className={styles.cancelButton}>
        Go Back
      </Button>
    );
  };

  const confirmButton = (handleSubmit) => {
    return (
      <Button onClick={handleSubmit} className={styles.confirmButton}>
        Confirm
      </Button>
    );
  };

  return (
    <div className={styles.question}>
      <div className={styles.questionContainer}>
        <RoleQ
          formState={signUpState}
          handleInputChange={handleSignUpInputChange}
        />
        <NameQ
          formState={signUpState}
          handleInputChange={handleSignUpInputChange}
        />
        <AccountQ
          formState={signUpState}
          handleInputChange={handleSignUpInputChange}
        />
        <MajorQ
          formState={signUpState}
          handleInputChange={handleSignUpInputChange}
        />
        <MinorQ
          formState={signUpState}
          handleInputChange={handleSignUpInputChange}
        />
        <GPAQ
          formState={signUpState}
          handleInputChange={handleSignUpInputChange}
        />
        <MessageQ
          formState={signUpState}
          handleInputChange={handleSignUpInputChange}
        />
        <div className={styles.confirmCancelContainer}>
          {goBackButton()}
          {confirmButton(handleSubmit)}
        </div>
      </div>
    </div>
  );
}

export default AccountCreationForm;
