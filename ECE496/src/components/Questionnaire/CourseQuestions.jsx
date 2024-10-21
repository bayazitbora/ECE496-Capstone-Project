import { useState } from "react";
import { Button, TextField } from "@mui/material";

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
