import QuestionOptions from "./QuestionOptions";

function Question6(formState, handleInputChange) {
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

export default Question6;
