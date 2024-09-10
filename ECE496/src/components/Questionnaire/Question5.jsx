import { useState } from "react";
import styles from "./Timetable.module.css";

function Question5(formState, handleInputChange) {
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

export default Question5;
