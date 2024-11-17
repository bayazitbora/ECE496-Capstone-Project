import {
  Button,
  Input,
  FormGroup,
  Label,
  Form,
  FormText,
} from "reactstrap";

export function RoleQ({ formState, handleInputChange }) {
  const handleRoleSelection = (role) => {
    handleInputChange({ target: { name: "role", value: role } });
  };

  return (
    <div>
      <h2>Welcome!</h2>
      <p>Are you a student or an instructor?</p>
      <div>
        <Button
          color={formState.role === "Student" ? "primary" : "secondary"}
          onClick={() => handleRoleSelection("Student")}
        >
          Student
        </Button>
        <Button
          color={formState.role === "Instructor" ? "primary" : "secondary"}
          onClick={() => handleRoleSelection("Instructor")}
        >
          Instructor
        </Button>
      </div>
    </div>
  );
}

export function NameQ({ formState, handleInputChange }) {
  return (
    <div>
      <h2>How should we call you?</h2>
      <Form>
        <FormGroup>
          <Label for="first_name">First Name</Label>
          <Input
            type="text"
            name="first_name"
            id="first_name"
            value={formState.first_name}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="last_name">Last Name</Label>
          <Input
            type="text"
            name="last_name"
            id="last_name"
            value={formState.last_name}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="username">Username</Label>
          <Input
            type="text"
            name="username"
            id="username"
            value={formState.username}
            onChange={handleInputChange}
          />
        </FormGroup>
      </Form>
    </div>
  );
}

export function AccountQ({ formState, handleInputChange }) {
  return (
    <div>
      <h2>Create your account</h2>
      <Form>
        <FormGroup>
          <Label for="email">E-mail address</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={formState.email}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="confirmEmail">Re-type your e-mail address</Label>
          <Input type="email" name="confirmEmail" id="confirmEmail" />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={formState.password}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="confirmPassword">Re-type your password</Label>
          <Input type="password" name="confirmPassword" id="confirmPassword" />
        </FormGroup>
      </Form>
    </div>
  );
}

export function MajorQ({ formState, handleInputChange }) {
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

  const handleMajorChange = (event) => {
    handleInputChange({
      target: { name: "pos", value: event.target.value },
    });
  };

  const handleGradYearChange = (event) => {
    handleInputChange({
      target: { name: "grad_year", value: event.target.value },
    });
  };

  return (
    <div>
      <h2>What is your Program of Study?</h2>
      <p>Choose your Engineering Major from the list:</p>
      <FormGroup>
        {majors.map((major, index) => (
          <FormGroup check key={index}>
            <Label check>
              <Input
                type="radio"
                name="major"
                value={major.label}
                checked={formState.pos === major.label}
                onChange={handleMajorChange}
              />
              {major.label}
            </Label>
          </FormGroup>
        ))}
      </FormGroup>
      <FormGroup>
        <Label for="grad_year">Expected Graduation Year</Label>
        <Input
          type="number"
          name="grad_year"
          id="grad_year"
          value={formState.grad_year || ""}
          onChange={handleGradYearChange}
          min={2024}
          max={2030}
        />
      </FormGroup>
    </div>
  );
}

export function MinorQ({ formState, handleInputChange }) {
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

  const handleMinorChange = (event) => {
    const { value, checked } = event.target;
    let updatedMinors = [...formState.minors];

    if (checked) {
      updatedMinors.push(value);
    } else {
      updatedMinors = updatedMinors.filter((minor) => minor !== value);
    }

    handleInputChange({ target: { name: "minors", value: updatedMinors } });
  };

  return (
    <div>
      <h2>Are you pursuing any Minor(s)?</h2>
      <p>Choose your Engineering Minor(s) from the list:</p>
      <FormGroup>
        {minors.map((minor, index) => (
          <FormGroup check key={index}>
            <Label check>
              <Input
                type="checkbox"
                value={minor.label}
                checked={formState.minors.includes(minor.label)}
                onChange={handleMinorChange}
              />
              {minor.label}
            </Label>
          </FormGroup>
        ))}
      </FormGroup>
    </div>
  );
}

export function GPAQ({ formState, handleInputChange }) {
  return (
    <div>
      <h2>What is your GPA? </h2>
      <FormGroup>
        <Label for="gpa">Enter your GPA</Label>
        <Input
          type="number"
          name="gpa"
          id="gpa"
          value={formState.gpa || ""}
          onChange={handleInputChange}
          step="0.01"
          min={0}
          max={4}
        />
        <FormText>Enter your GPA (0 - 4 scale)</FormText>
      </FormGroup>
    </div>
  );
}

export function MessageQ() {
  return (
    <div>
      <h2>Thank you for your help!</h2>
      <p>We will take it over from here.</p>
      <br />
      <p>You can modify your answers in your Profile.</p>
    </div>
  );
}
