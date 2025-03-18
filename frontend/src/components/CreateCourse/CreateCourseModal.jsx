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

const CreateCourseModal = ({
  handleOpen,
  handleClose,
  handleCreate,
  courseState,
  setCourseState,
}) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setCourseState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreate(courseState);
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
              value={courseState.courseCode}
              onChange={handleChange}
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
                  value={courseState.session}
                  onChange={handleChange}
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
                  value={courseState.year}
                  onChange={handleChange}
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
              value={courseState.courseName}
              onChange={handleChange}
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
              value={courseState.courseDescription}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="groupSize">Group Size</Label>
            <Input
              type="number"
              id="groupSize"
              placeholder="Enter group size"
              value={courseState.groupSize}
              onChange={handleChange}
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
