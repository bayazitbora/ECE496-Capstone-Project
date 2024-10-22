import { Modal, Box } from "@mui/material";

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
      open={handleOpen}
      onClose={handleClose}
      aria-labelledby="add-course-modal"
      aria-describedby="modal-for-adding-course"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
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
      </Box>
    </Modal>
  );
}

export default AddCourseModal;
