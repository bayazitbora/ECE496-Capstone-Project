import {
  Button,
  Input,
  FormGroup,
  Label,
  Form,
  FormText,
  ButtonGroup,
} from "reactstrap";
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

  const handleRoleSelection = (teacher) => {
    handleSignUpInputChange({ target: { name: "teacher", value: teacher } });
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    const username = email.split("@")[0];
    handleSignUpInputChange({ target: { name: "email", value: email } });
    handleSignUpInputChange({ target: { name: "username", value: username } });
  };

  const handleMajorChange = (event) => {
    handleSignUpInputChange({
      target: { name: "pos", value: event.target.value },
    });
  };

  const handleGradYearChange = (event) => {
    handleSignUpInputChange({
      target: { name: "grad_year", value: event.target.value },
    });
  };

  const handleMinorChange = (event) => {
    const { value } = event.target;
    if (!signUpState.minors.includes(value)) {
      const updatedMinors = [...signUpState.minors, value];
      handleSignUpInputChange({
        target: { name: "minors", value: updatedMinors },
      });
    }
  };

  const handleMinorRemove = (minor) => {
    const updatedMinors = signUpState.minors.filter((m) => m !== minor);
    handleSignUpInputChange({
      target: { name: "minors", value: updatedMinors },
    });
  };

  const majors = [
    { label: "Chemical" },
    { label: "Civil" },
    { label: "Electrical & Computer" },
    { label: "Industrial" },
    { label: "Materials" },
    { label: "Mechanical" },
    { label: "Mineral" },
    { label: "Engineering Science" },
  ];

  const minors = [
    { label: "Advanced Manufacturing" },
    { label: "AI Engineering" },
    { label: "Bioengineering" },
    { label: "Biomedical Engineering" },
    { label: "Engineering Business" },
    { label: "Environmental Engineering" },
    { label: "Global Leadership" },
    { label: "Music Performance" },
    { label: "Nanoengineering" },
    { label: "Robotics & Mechatronics" },
    { label: "Sustainable Energy" },
  ];

  return (
    <div className={styles.question}>
      <div className={styles.questionContainer}>
        <div>
          <h2>Welcome! Are you a student or an instructor?</h2>
          <ButtonGroup size="lg">
            <Button
              color="primary"
              outline
              onClick={() => handleRoleSelection("False")}
              active={signUpState.teacher === "False"}
            >
              Student
            </Button>
            <Button
              color="primary"
              outline
              onClick={() => handleRoleSelection("True")}
              active={signUpState.teacher === "True"}
            >
              Instructor
            </Button>
          </ButtonGroup>
        </div>
        <div>
          <h2>Create your account</h2>
          <Form className={styles.leftAlign}>
            <FormGroup>
              <Input
                type="text"
                name="last_name"
                id="last_name"
                placeholder="Full Name"
                value={signUpState.last_name}
                onChange={handleSignUpInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="E-mail address"
                value={signUpState.email}
                onChange={handleEmailChange}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={signUpState.password}
                onChange={handleSignUpInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Re-type your password"
                value={signUpState.confirmPassword}
                onChange={handleSignUpInputChange}
              />
            </FormGroup>
            <p>Choose your Engineering Major from the list:</p>
            <FormGroup>
              <Input
                type="select"
                name="major"
                id="major"
                value={signUpState.pos || ""}
                onChange={handleMajorChange}
              >
                <option value="" disabled>
                  Choose Major...
                </option>
                {majors.map((major, index) => (
                  <option key={index} value={major.label}>
                    {major.label}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Input
                type="number"
                name="grad_year"
                id="grad_year"
                value={signUpState.grad_year || ""}
                onChange={handleGradYearChange}
                min={2024}
                max={2030}
                placeholder="Choose Graduation Year..."
              />
            </FormGroup>
            <p>Choose your Engineering Minor(s) from the list:</p>
            <FormGroup>
              <Input
                type="select"
                name="minor"
                id="minor"
                value=""
                onChange={handleMinorChange}
              >
                <option value="" disabled>
                  Choose Minor...
                </option>
                {minors.map((minor, index) => (
                  <option key={index} value={minor.label}>
                    {minor.label}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <div>
              {signUpState.minors.map((minor, index) => (
                <Button
                  key={index}
                  color="outline"
                  onClick={() => handleMinorRemove(minor)}
                  style={{ marginRight: "10px", marginBottom: "10px" }}
                >
                  {minor} &times;
                </Button>
              ))}
            </div>
            <FormGroup>
              <Label for="gpa">Enter your GPA:</Label>
              <Input
                type="number"
                name="gpa"
                id="gpa"
                value={signUpState.gpa || ""}
                onChange={handleSignUpInputChange}
                step="0.01"
                min={0}
                max={4}
              />
              <FormText>Enter your GPA (0 - 4 scale)</FormText>
            </FormGroup>
          </Form>
        </div>
        <div>
          <p>You can modify your answers in your Profile.</p>
        </div>
        <div className={styles.confirmCancelContainer}>
          {goBackButton()}
          {confirmButton(handleSubmit)}
        </div>
      </div>
    </div>
  );
}

export default AccountCreationForm;
