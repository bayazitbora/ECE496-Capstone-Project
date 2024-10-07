import { useState } from "react";
import { Button, TextField } from "@mui/material";

import QuestionOptions from "./QuestionOptions";
import styles from "./Timetable.module.css";

export function Question0() {
  return (
    <div>
      <h2>Welcome!</h2>
      <text>Are you a student or an instructor?</text>
      <div>
        <Button variant="outlined">Student</Button>
        <Button variant="outlined">Instructor</Button>
      </div>
    </div>
  );
}

export function Question1({ formState, handleInputChange }) {
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

export function Question2(formState, handleInputChange) {
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

export function Question3() {
  return (
    <div>
      <h2>Tell us about you</h2>
      <text>In order to find you a team, we need to learn more about you.</text>
      <br />
      <text>You will be able to modify your answers later.</text>
      <br />
      <text>It will only take 5 minutes.</text>
      <br />
    </div>
  );
}

export function Question4({ formState, handleInputChange }) {
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

export function Question5(formState, handleInputChange) {
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  //   TODO: update formState

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const hours = Array.from(
    { length: 12 },
    (_, i) => `${8 + i}:00 ${8 + i < 12 ? "AM" : "PM"}`
  );

  const handleBlockClick = (day, time) => {
    const block = { day, time };
    const isSelected = selectedBlocks.some(
      (b) => b.day === block.day && b.time === block.time
    );

    if (isSelected) {
      setSelectedBlocks((prev) =>
        prev.filter((b) => b.day !== block.day || b.time !== block.time)
      );
    } else {
      setSelectedBlocks((prev) => [...prev, block]);
    }
  };

  const isBlockSelected = (day, time) => {
    return selectedBlocks.some(
      (block) => block.day === day && block.time === time
    );
  };

  return (
    <div>
      <h2>When are you free during the week?</h2>
      <div className={styles.timetableContainer}>
        <table className={styles.timetable}>
          <thead>
            <tr>
              <th>Time</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr key={hour}>
                <td>{hour}</td>
                {days.map((day) => (
                  <td
                    key={`${day}-${hour}`}
                    className={`${styles.timeBlock} ${
                      isBlockSelected(day, hour) ? styles.selected : ""
                    }`}
                    onClick={() => handleBlockClick(day, hour)}
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* <div>
        <h4>Selected Time Blocks:</h4>
        <ul>
          {selectedBlocks.map((block, index) => (
            <li key={index}>
              {block.day} - {block.time}
            </li>
          ))}
        </ul>
      </div> */}
      </div>
    </div>
  );
}

export function Question6(formState, handleInputChange) {
  const frequency_pref = [
    { label: "1 hours" },
    { label: "2 hours" },
    { label: "3 hours" },
    { label: "4 hours" },
    { label: "5 hours" },
    { label: "+ 5 hours" },
  ];
  // TODO: Update formState
  return (
    <div>
      <h2>How often would you like to meet your team? </h2>
      <text>Preferred number of meeting hours per week:</text>
      <QuestionOptions
        choices={frequency_pref}
        selectedValues={formState.meeting_frequency || []}
        fieldName={"meeting_frequency"}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}

export function Question7(formState, handleInputChange) {
  const gpa_ranges = [
    { label: "3.50 or above" },
    { label: "3.00 to 3.50" },
    { label: "2.50 to 3.00" },
    { label: "2.00 to 2.50" },
    { label: "Less than 2.00" },
  ];
  // TODO: Update formState
  return (
    <div>
      <h2>What is your GPA? </h2>
      <text>Choose one of the ranges below:</text>
      <QuestionOptions
        choices={gpa_ranges}
        selectedValues={formState.gpa_range || []}
        fieldName={"gpa_range"}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}

export function Question8(formState, handleInputChange) {
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
  // TODO: Update formState
  return (
    <div>
      <h2>What is your Program of Study? </h2>
      <text>Choose your Engineering Major amongst the list:</text>
      <QuestionOptions
        choices={majors}
        selectedValues={formState.major || []}
        fieldName={"major"}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}

export function Question9(formState, handleInputChange) {
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
  // TODO: Update formState
  return (
    <div>
      <h2>Are you pursuing any Minor(s)? </h2>
      <text>Choose your Engineering Minor(s) amongst the list:</text>
      <QuestionOptions
        choices={minors}
        selectedValues={formState.minors || []}
        fieldName={"minors"}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}

export function Question10(formState, handleInputChange) {
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

export function Question11() {
  return (
    <div>
      <h2>Thank you for your help!</h2>
      <text>We will take it over from here.</text>
      <br />
      <text>You can modify your answers in your Profile.</text>
    </div>
  );
}
