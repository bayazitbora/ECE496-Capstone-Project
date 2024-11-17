import QuestionOptions from "../AccountCreation/QuestionOptions";
import {
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

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
    console.log("Selected course:", event.target.value); // Log the selected course
    handleInputChange(event);
  };

  return (
    <div>
      <h2>What course are you registered in?</h2>
      <Form>
        <FormGroup>
          <Label for="course-select">Course</Label>
          <Input
            type="select"
            name="course"
            id="course-select"
            value={formState.course || ""}
            onChange={handleCourseChange}
          >
            {courses.map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </Input>
        </FormGroup>
      </Form>
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

  const handleInterestChange = (event) => {
    const { value, checked } = event.target;
    let updatedInterests = [...formState.interests];

    if (checked) {
      updatedInterests.push(value);
    } else {
      updatedInterests = updatedInterests.filter(
        (interest) => interest !== value
      );
    }

    handleInputChange({
      target: { name: "interests", value: updatedInterests },
    });
  };

  return (
    <div>
      <h2>What are your Project Interests?</h2>
      <p>Choose your interests from the list:</p>
      <FormGroup>
        {interests.map((interest, index) => (
          <FormGroup check key={index}>
            <Label check>
              <Input
                type="checkbox"
                value={interest.label}
                checked={formState.interests.includes(interest.label)}
                onChange={handleInterestChange}
              />
              {interest.label}
            </Label>
          </FormGroup>
        ))}
      </FormGroup>
    </div>
  );
}

export function FrequencyQ({ formState, handleInputChange }) {
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
      <p>Preferred number of meeting hours per week:</p>
      <QuestionOptions
        choices={frequency_pref}
        selectedValues={formState.frequency || ""}
        fieldName={"meeting_frequency"}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}

export function SkillsQ({ formState, handleInputChange }) {
  const skills = [
    { label: "Communication" },
    { label: "Leadership" },
    { label: "Critical Thinking" },
    { label: "Creative Thinking" },
    { label: "Emotional Intelligence" },
    { label: "Ethical Perspective" },
    { label: "Teamwork" },
  ];
  return (
    <div>
      <h2>What are your skills? </h2>
      <p>Choose from the list of relevant skills:</p>
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
      <p>We will take it over from here.</p>
    </div>
  );
}
