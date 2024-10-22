import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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

  const navigate = useNavigate();
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
    navigate("/courses");
  };

  const handleFormInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className={styles.Container}>
      <h1>Courses</h1>
      <p>Add courses by pressing on the Add (+) button.</p>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
        }}
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>

      <AddCourseModal
        currentStep={currentStep}
        handleOpen={open}
        handleClose={handleClose}
        nextStep={nextStep}
        prevStep={prevStep}
        formState={formState}
        handleInputChange={handleFormInputChange}
        handleSubmit={handleSubmit}
        totalSteps={totalSteps}
      />
    </div>
  );
}

export default Courses;
