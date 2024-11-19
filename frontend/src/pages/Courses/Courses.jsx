import { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddCourseModal from "../../components/AddCourse/AddCourseModal";
import styles from "./Courses.module.css";

function Courses() {
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({
    course: "",
    interests: [],
    availability: [],
    frequency: "",
    skills: [],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submit button clicked");
    setFormState(formState);
    console.log(formState);
    handleClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className={styles.Container}>
        <h1>Courses</h1>
        <p>Add courses by pressing on the Add (+) button.</p>

        {/* Floating Action Button */}
        <Button
          color="primary"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
          }}
          onClick={handleOpen}
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>

        <Modal isOpen={open} toggle={handleClose}>
          <ModalHeader toggle={handleClose}>Add Course</ModalHeader>
          <ModalBody>
            <AddCourseModal
              currentStep={currentStep}
              handleOpen={open}
              handleClose={handleClose}
              nextStep={nextStep}
              prevStep={prevStep}
              formState={formState}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              totalSteps={totalSteps}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
}

export default Courses;
