import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
function Profile() {
  const [userProfile, setUserProfile] = useState({
    profile_type: "student", // or "instr"
    first_name: "Adrien",
    last_name: "Mery",
    username: "adrienMery007",
    email: "adrien@mery.com",
    password: "********", // Keep password hidden
    courses: [
      {
        course_name: "Introduction to Electronics",
        project_interests: ["Analog Electronics", "Signal Processing"],
        availability: ["Monday", "Wednesday"],
        meeting_frequency: "Weekly",
        gpa_range: "3.5-4.0",
        major: "Electrical Engineering",
        minors: ["Computer Science"],
        courses_taken: ["Physics", "Calculus I", "Circuits"],
        skills: ["Circuit Design", "MATLAB"],
      },
      {
        course_name: "Software Engineering",
        project_interests: ["Software Architecture", "AI"],
        availability: ["Tuesday", "Thursday"],
        meeting_frequency: "Bi-weekly",
        gpa_range: "3.0-3.5",
        major: "Computer Science",
        minors: ["Data Science"],
        courses_taken: ["Algorithms", "Data Structures", "Machine Learning"],
        skills: ["JavaScript", "Python", "React"],
      },
    ],
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>
        {userProfile.first_name} {userProfile.last_name}'s Profile
      </h1>
      <div style={{ marginBottom: "20px" }}>
        <p>
          <strong>Profile Type:</strong> {userProfile.profile_type}
        </p>
        <p>
          <strong>Username:</strong> {userProfile.username}
        </p>
        <p>
          <strong>Email:</strong> {userProfile.email}
        </p>
        <p>
          <strong>Password:</strong> {userProfile.password}
        </p>
      </div>

      <h2>Courses Registered</h2>
      {userProfile.courses.map((course, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <Typography>{course.course_name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <strong>Project Interests:</strong>{" "}
              {course.project_interests.join(", ")}
            </Typography>
            <Typography>
              <strong>Availability:</strong> {course.availability.join(", ")}
            </Typography>
            <Typography>
              <strong>Meeting Frequency:</strong> {course.meeting_frequency}
            </Typography>
            <Typography>
              <strong>GPA Range:</strong> {course.gpa_range}
            </Typography>
            <Typography>
              <strong>Major:</strong> {course.major}
            </Typography>
            <Typography>
              <strong>Minors:</strong> {course.minors.join(", ")}
            </Typography>
            <Typography>
              <strong>Courses Taken:</strong> {course.courses_taken.join(", ")}
            </Typography>
            <Typography>
              <strong>Skills:</strong> {course.skills.join(", ")}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default Profile;
