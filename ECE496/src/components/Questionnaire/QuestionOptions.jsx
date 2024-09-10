import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";

function QuestionOptions({ choices }) {
  return (
    <FormGroup>
      {choices.map((interest, index) => (
        <FormControlLabel
          key={index}
          control={<Checkbox />}
          label={interest.label}
        />
      ))}
    </FormGroup>
  );
}

export default QuestionOptions;
