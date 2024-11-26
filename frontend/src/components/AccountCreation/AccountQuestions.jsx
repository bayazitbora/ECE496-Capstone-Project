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
          style={{ marginRight: "10px" }}
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
          <Input
            type="text"
            name="first_name"
            id="first_name"
            placeholder="First Name"
            value={formState.first_name}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="text"
            name="last_name"
            id="last_name"
            placeholder="Last Name"
            value={formState.last_name}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
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
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="E-mail address"å
            value={formState.email}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Input type="email" name="confirmEmail" id="confirmEmail" placeholder="Re-type your e-mail address" />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={formState.password}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Input type="password" name="confirmPassword" id="confirmPassword" placeholder="Re-type your password" />
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
        <Input
          type="select"
          name="major"
          id="major"
          value={formState.pos || ""}
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
          value={formState.grad_year}
          onChange={handleGradYearChange}
          min={2024}
          max={2030}
          placeholder="Choose Graduation Year..."
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
    const { value } = event.target;
    if (!formState.minors.includes(value)) {
      const updatedMinors = [...formState.minors, value];
      handleInputChange({ target: { name: "minors", value: updatedMinors } });
    }
  };

  const handleMinorRemove = (minor) => {
    const updatedMinors = formState.minors.filter((m) => m !== minor);
    handleInputChange({ target: { name: "minors", value: updatedMinors } });
  };

  return (
    <div>
      <h2>Are you pursuing any Minor(s)?</h2>
      <p>Choose your Engineering Minor(s) from the list:</p>
      <FormGroup>
        <Input type="select" name="minor" id="minor" onChange={handleMinorChange}>
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
        {formState.minors.map((minor, index) => (
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
          value={formState.gpa || 0}
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
