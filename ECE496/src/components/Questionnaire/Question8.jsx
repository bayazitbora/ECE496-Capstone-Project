import QuestionOptions from "./QuestionOptions";

function Question8(formState, handleInputChange) {
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
      <QuestionOptions choices={majors} />
    </div>
  );
}

export default Question8;
