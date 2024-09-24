import QuestionOptions from "./QuestionOptions";

function Question4({ formState, handleInputChange }) {
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

export default Question4;
