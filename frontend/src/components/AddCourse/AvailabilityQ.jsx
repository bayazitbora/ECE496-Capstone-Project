import { useState } from "react";
import styles from "./AvailabilityQ.module.css";

function AvailabilityQ({ formState, handleInputChange }) {
  const [selectedBlocks, setSelectedBlocks] = useState(
    formState.availability || []
  );

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
    const block = `${day}-${time}`;
    const isSelected = selectedBlocks.includes(block);

    let updatedBlocks;

    if (isSelected) {
      updatedBlocks = selectedBlocks.filter((b) => b !== block);
    } else {
      updatedBlocks = [...selectedBlocks, block];
    }

    setSelectedBlocks(updatedBlocks);

    handleInputChange({
      target: {
        name: "availability",
        value: updatedBlocks,
      },
    });
  };

  const isBlockSelected = (day, time) => {
    return selectedBlocks.includes(`${day}-${time}`);
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
      </div>
    </div>
  );
}

export default AvailabilityQ;
