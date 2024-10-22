import QuestionOptions from "./../AccountCreation/QuestionOptions";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export function CourseNameQ({ formState, handleInputChange }) {
  const courses = [
    "ECE496",
    "ECE490",
    "ECE297",
    "CSCS343",
    "ECE444",
    "ECE421",
    "APS360",
  ];

  const handleCourseChange = (event) => {
    handleInputChange({
      target: { name: "course", value: event.target.value },
    });
  };

  return (
    <div>
      <h2>What course are you registered in?</h2>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="course-label">Course</InputLabel>
        <Select
          labelId="course-label"
          id="course-select"
          value={formState.course || ""}
          onChange={handleCourseChange}
          label="Course"
        >
          {courses.map((course, index) => (
            <MenuItem key={index} value={course}>
              {course}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export function InterestsQ({ formState, handleInputChange }) {
  const interests = [
    { label: "Analog Electronics" },
    { label: "Digital Electronics" },
    { label: "Communications" },
    { label: "Signal Processing & Control" },
    { label: "Computer Hardware" },
    { label: "Computer Networks" },
    { label: "Electromagnetics" },
    { label: "Energy Systems" },
    { label: "Photonics" },
    { label: "Semiconductor Physics" },
    { label: "Software" },
  ];

  return (
    <div>
      <h2>What are your Project Interests?</h2>
      <p>Choose 1 or 2 interests.</p>
      <QuestionOptions
        choices={interests}
        selectedValues={formState.interests || []}
        fieldName={"interests"}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}

export function FrequencyQ(formState, handleInputChange) {
  const frequency_pref = [
    { label: "1 hours" },
    { label: "2 hours" },
    { label: "3 hours" },
    { label: "4 hours" },
    { label: "5 hours" },
    { label: "+ 5 hours" },
  ];
  return (
    <div>
      <h2>How often would you like to meet your team? </h2>
      <text>Preferred number of meeting hours per week:</text>
      <QuestionOptions
        choices={frequency_pref}
        selectedValues={formState.frequency || ""}
        fieldName={"meeting_frequency"}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}

export function SkillsQ(formState, handleInputChange) {
  const skills = [
    { label: "Communication" },
    { label: "Leadership" },
    { label: "Critical Thinking" },
    { label: "Creative Thinking" },
    { label: "Emotional Intelligence" },
    { label: "Ethical Perspective" },
    { label: "Teamwork" },
  ];
  // TODO: Update formState
  return (
    <div>
      <h2>What are your skills? </h2>
      <text>Choose from the list of relevant skills:</text>
      <QuestionOptions
        choices={skills}
        selectedValues={formState.skills || []}
        fieldName={"skills"}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}

export function ThankYouQ() {
  return (
    <div>
      <h2>Thank you for your help!</h2>
      <text>We will take it over from here.</text>
    </div>
  );
}
