import QuestionOptions from "./QuestionOptions";

function Question10(formState, handleInputChange) {
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
      <QuestionOptions choices={skills} />
    </div>
  );
}

export default Question10;
