import QuestionOptions from "./QuestionOptions";

function Question7(formState, handleInputChange) {
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

export default Question7;
