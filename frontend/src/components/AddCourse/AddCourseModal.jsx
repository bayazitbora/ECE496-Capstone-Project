import { Modal, ModalBody } from "reactstrap";

import AddCourseTemplate from "./AddCourseTemplate";

function AddCourseModal({
  currentStep,
  handleOpen,
  handleClose,
  nextStep,
  prevStep,
  formState,
  handleInputChange,
  handleSubmit,
  totalSteps,
}) {
  return (
    <Modal
      isOpen={handleOpen}
      toggle={handleClose}
      aria-labelledby="add-course-modal"
      aria-describedby="modal-for-adding-course"
    >
      <ModalBody
        style={{
          position: "relative",
          width: "700px",
          margin: "auto",
          backgroundColor: "white",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        <AddCourseTemplate
          currentStep={currentStep}
          nextStep={nextStep}
          prevStep={prevStep}
          formState={formState}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          totalSteps={totalSteps}
        />
      </ModalBody>
    </Modal>
  );
}

export default AddCourseModal;
