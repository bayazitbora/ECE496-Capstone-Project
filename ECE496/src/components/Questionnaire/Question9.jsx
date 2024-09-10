import QuestionOptions from "./QuestionOptions";

function Question9(formState, handleInputChange) {
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
      <QuestionOptions choices={minors} />
    </div>
  );
}

export default Question9;
