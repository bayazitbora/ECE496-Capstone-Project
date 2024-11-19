import { FormGroup, Label, Input } from "reactstrap";

function QuestionOptions({
  choices,
  selectedValues,
  fieldName,
  handleInputChange,
}) {
  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;

    let updatedValues = [...selectedValues];

    if (checked) {
      updatedValues.push(value);
    } else {
      updatedValues = updatedValues.filter((item) => item !== value);
    }

    // Debugging: Check what gets passed to handleInputChange
    console.log(`Updating ${fieldName} with values:`, updatedValues);

    handleInputChange({ target: { name: fieldName, value: updatedValues } });
  };

  return (
    <FormGroup>
      {choices.map((choice, index) => (
        <div key={index} className="form-check">
          <Label check>
            <Input
              type="checkbox"
              checked={selectedValues.includes(choice.label)}
              onChange={handleCheckboxChange} 
              name={fieldName}
              value={choice.label}
            />
            {choice.label}
          </Label>
        </div>
      ))}
    </FormGroup>
  );
}

export default QuestionOptions;
