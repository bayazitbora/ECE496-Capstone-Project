import {
  Button,
  TextField,
  Checkbox,
  Radio,
  RadioGroup,
  FormGroup,
  FormControlLabel,
} from "@mui/material";

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
          variant={formState.role === "Student" ? "contained" : "outlined"}
          onClick={() => handleRoleSelection("Student")}
        >
          Student
        </Button>
        <Button
          variant={formState.role === "Instructor" ? "contained" : "outlined"}
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
      <div>
        <TextField
          id="name-input"
          label="First Name"
          variant="outlined"
          margin="normal"
          name="first_name"
          value={formState.first_name}
          onChange={handleInputChange}
        />
        <TextField
          id="name-input"
          label="Last Name"
          variant="outlined"
          margin="normal"
          name="last_name"
          value={formState.last_name}
          onChange={handleInputChange}
        />
      </div>
      <TextField
        id="standard-input"
        label="Username"
        variant="outlined"
        margin="normal"
        name="username"
        value={formState.username}
        onChange={handleInputChange}
      />
    </div>
  );
}

export function AccountQ(formState, handleInputChange) {
  return (
    <div>
      <h2>Create your account</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField
          id="standard-input"
          label="E-mail address"
          variant="outlined"
          margin="normal"
          name="email"
          value={formState.email}
          onChange={handleInputChange}
        />
        <TextField
          id="standard-input"
          label="Re-type your e-mail address"
          variant="outlined"
          margin="normal"
          name="confirmEmail"
        />
        <TextField
          id="standard-input"
          label="Password"
          variant="outlined"
          margin="normal"
          name="password"
          value={formState.password}
          onChange={handleInputChange}
        />
        <TextField
          id="standard-input"
          label="Re-type your password"
          variant="outlined"
          margin="normal"
          name="confirmPassword"
        />
      </div>
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
    handleInputChange({ target: { name: "major", value: event.target.value } });
  };

  return (
    <div>
      <h2>What is your Program of Study?</h2>
      <p>Choose your Engineering Major from the list:</p>
      <RadioGroup
        aria-label="major"
        name="major"
        value={formState.major || ""}
        onChange={handleMajorChange}
      >
        {majors.map((major, index) => (
          <FormControlLabel
            key={index}
            value={major.label}
            control={<Radio />}
            label={major.label}
          />
        ))}
      </RadioGroup>
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
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                value={minor.label}
                checked={formState.minors.includes(minor.label)}
                onChange={handleMinorChange}
              />
            }
            label={minor.label}
          />
        ))}
      </FormGroup>
    </div>
  );
}

export function GPAQ({ formState, handleInputChange }) {
  return (
    <div>
      <h2>What is your GPA? </h2>
      <TextField
        label="Enter your GPA"
        variant="outlined"
        type="number"
        name="gpa"
        value={formState.gpa || ""}
        onChange={handleInputChange}
        fullWidth
        inputProps={{
          step: "0.01", // Allows the user to input with two decimal precision
          min: 0,
          max: 4,
        }}
        helperText="Enter your GPA (0 - 4 scale)"
      />
    </div>
  );
}

export function MessageQ() {
  return (
    <div>
      <h2>Thank you for your help!</h2>
      <text>We will take it over from here.</text>
      <br />
      <text>You can modify your answers in your Profile.</text>
    </div>
  );
}
