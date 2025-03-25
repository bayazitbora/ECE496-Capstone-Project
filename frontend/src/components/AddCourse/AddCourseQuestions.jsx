import { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { privateAxios, setPrivateAxiosToken } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

export function CourseNameQ({ formState, handleInputChange }) {
  const { token } = useAuth();
  const [courses, setCourses] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      setPrivateAxiosToken(token);
      try {
        const response = await privateAxios.post("listCourses/", {});
        const courseData = response.data;
        setCourses(courseData);
        if (!formState.courseCode && Object.keys(courseData).length > 0) {
          handleInputChange({
            target: { name: "courseCode", value: Object.keys(courseData)[0] },
          });
        }
        console.log("Available courses:", courseData);
      } catch (error) {
        console.error("Error fetching available courses:", error);
      }
    };

    fetchCourses();
  }, [token, formState.courseCode, handleInputChange]);

  const handleCourseChange = (event) => {
    const { value } = event.target;
    handleInputChange({
      target: { name: "courseCode", value: value },
    });
    console.log("Selected courseCode:", value);
  };

  return (
    <div>
      <h2>What course are you registered in?</h2>
      <Form>
        <FormGroup>
          <Label for="course-select">Course</Label>
          <Input
            type="select"
            name="courseCode"
            id="course-select"
            value={formState.courseCode}
            onChange={handleCourseChange}
          >
            {Object.keys(courses).map((courseCode) => (
              <option key={courseCode} value={courseCode}>
                {`${courseCode} - ${courses[courseCode].session} ${courses[courseCode].year}`}
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
    { label: "1 hour", value: 1 },
    { label: "2 hours", value: 2 },
    { label: "3 hours", value: 3 },
    { label: "4 hours", value: 4 },
    { label: "5 hours", value: 5 },
  ];

  const handleFrequencyChange = (event) => {
    const { value } = event.target;
    handleInputChange({
      target: { name: "hoursToCommit", value: parseInt(value, 10) },
    });
  };

  return (
    <div>
      <h2>How often would you like to meet your team?</h2>
      <p>Preferred number of meeting hours per week:</p>
      <FormGroup>
        {frequency_pref.map((frequency, index) => (
          <FormGroup check key={index}>
            <Label check>
              <Input
                type="radio"
                name="hoursToCommit"
                value={frequency.value}
                checked={formState.hoursToCommit === frequency.value}
                onChange={handleFrequencyChange}
              />
              {frequency.label}
            </Label>
          </FormGroup>
        ))}
      </FormGroup>
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

  const handleSkillsChange = (event) => {
    const { value, checked } = event.target;
    let updatedSkills = [...formState.skills];

    if (checked) {
      updatedSkills.push(value);
    } else {
      updatedSkills = updatedSkills.filter((skill) => skill !== value);
    }

    handleInputChange({
      target: { name: "skills", value: updatedSkills },
    });
  };

  return (
    <div>
      <h2>What are your skills?</h2>
      <p>Choose from the list of relevant skills:</p>
      <FormGroup>
        {skills.map((skill, index) => (
          <FormGroup check key={index}>
            <Label check>
              <Input
                type="checkbox"
                value={skill.label}
                checked={formState.skills.includes(skill.label)}
                onChange={handleSkillsChange}
              />
              {skill.label}
            </Label>
          </FormGroup>
        ))}
      </FormGroup>
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
