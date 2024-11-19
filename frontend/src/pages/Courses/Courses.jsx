import { useState, useContext, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddCourseModal from "../../components/AddCourse/AddCourseModal";
import styles from "./Courses.module.css";
import { createProfile, getSelf } from "../../api/api";
import { SignUpContext } from "../../context/SignUpContext";

function Courses() {
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({
    courseCode: "",
    interests: [],
    availableTimes: [],
    hoursToCommit: 0,
    skills: [],
  });
  const { state: signUpState } = useContext(SignUpContext);
  const { username, profiles: initialProfiles } = signUpState;
  const [profiles, setProfiles] = useState(initialProfiles || {});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  useEffect(() => {
      if (initialProfiles) {
        setProfiles(initialProfiles);
      } else {
        const fetchProfiles = async () => {
          try {
            const response = await getSelf({ username });
            setProfiles(response.profiles);
            console.log("User profiles:", response.profiles);
          } catch (error) {
            console.error("Error fetching profiles:", error);
          }
        };

        fetchProfiles();
      }
  }, [username, initialProfiles]);

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

    try {
      const response = await createProfile(username, formState);
      console.log("Profile created successfully:", response);

      const updatedProfiles = await getSelf({ username });
      setProfiles(updatedProfiles.profiles);
      console.log("Updated profiles:", updatedProfiles.profiles);

      setFormState({
        courseCode: "",
        interests: [],
        availableTimes: [],
        hoursToCommit: 0,
        skills: [],
      });
    } catch (error) {
      console.error("Error creating profile:", error);
    }

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

        {/* Display user profiles */}
        <div>
          <h2>User Profiles</h2>
          {Object.keys(profiles).length > 0 ? (
            <ul>
              {Object.keys(profiles).map((courseCode) => (
                <li key={courseCode}>
                  <strong>{courseCode}:</strong> {JSON.stringify(profiles[courseCode])}
                </li>
              ))}
            </ul>
          ) : (
            <p>No profiles found.</p>
          )}
        </div>

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
