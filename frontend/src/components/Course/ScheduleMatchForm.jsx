import { useState } from "react";
import { Button, Form, FormGroup, Label } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ScheduleMatchForm = ({ onSubmit }) => {
  const [matchDate, setMatchDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(matchDate);
  };

  return (
    <Form onSubmit={handleSubmit} inline>
      <FormGroup className="d-flex align-items-center justify-content-between w-100">
        <div className="d-flex align-items-center">
          <Label for="matchDate" className="mr-2">
            Match date & time:
          </Label>
          <DatePicker
            selected={matchDate}
            onChange={(date) => setMatchDate(date)}
            showTimeSelect
            dateFormat="Pp"
            className="form-control mr-3"
          />
        </div>
        <Button type="submit" color="primary">
          Schedule Match
        </Button>
      </FormGroup>
    </Form>
  );
};

export default ScheduleMatchForm;
