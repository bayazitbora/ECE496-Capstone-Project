import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";

const CreateCourseModal = ({ handleOpen, handleClose, handleCreate }) => {
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [session, setSession] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreate({
      courseCode: courseCode,
      courseName: courseName,
      groupSize: groupSize,
      session: session,
      year: year,
    });
    setCourseCode("");
    setCourseName("");
    setCourseDescription("");
    setGroupSize("");
    setSession("");
    setYear("");
    handleClose();
  };

  return (
    <Modal isOpen={handleOpen} toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Create New Course</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="courseCode">Course Code</Label>
            <Input
              type="text"
              id="courseCode"
              placeholder="Enter course code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              required
            />
          </FormGroup>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="session">Session</Label>
                <Input
                  type="select"
                  id="session"
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  required
                >
                  <option value="">Select session</option>
                  <option value="Fall">Fall</option>
                  <option value="Winter">Winter</option>
                  <option value="Summer">Summer</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="year">Year</Label>
                <Input
                  type="number"
                  id="year"
                  placeholder="Enter year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label for="courseName">Course Name</Label>
            <Input
              type="text"
              id="courseName"
              placeholder="Enter course name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="courseDescription">Course Description</Label>
            <Input
              type="textarea"
              id="courseDescription"
              rows={3}
              placeholder="Enter course description"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="groupSize">Group Size</Label>
            <Input
              type="number"
              id="groupSize"
              placeholder="Enter group size"
              value={groupSize}
              onChange={(e) => setGroupSize(e.target.value)}
              required
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" type="submit">
            Create Course
          </Button>
          <Button color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default CreateCourseModal;
