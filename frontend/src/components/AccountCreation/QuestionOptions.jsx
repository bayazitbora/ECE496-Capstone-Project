import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useEffect } from "react";

function QuestionOptions({
  choices,
  selectedValues,
  fieldName,
  handleInputChange,
}) {
  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;

    let updatedValues = [...selectedValues]; // Copy current selected values

    if (checked) {
      updatedValues.push(value); // Add the new selected value
    } else {
      updatedValues = updatedValues.filter((item) => item !== value); // Remove unchecked value
    }

    // Debugging: Check what gets passed to handleInputChange
    console.log(`Updating ${fieldName} with values:`, updatedValues);

    // Use the fieldName as the `name` and pass the updated values array as the `value`
    handleInputChange({ target: { name: fieldName, value: updatedValues } });
  };

  // Debugging: Check initial selectedValues
  useEffect(() => {
    console.log("Selected values:", selectedValues);
  }, [selectedValues]);

  return (
    <FormGroup>
      {choices.map((choice, index) => (
        <FormControlLabel
          key={index}
          control={
            <Checkbox
              checked={selectedValues.includes(choice.label)} // Check if the label is already selected
              onChange={handleCheckboxChange} // Handle checkbox state changes
              name={fieldName} // Name is the field in the form (e.g., "interests")
              value={choice.label} // Value is the individual interest label
            />
          }
          label={choice.label}
        />
      ))}
    </FormGroup>
  );
}

export default QuestionOptions;
