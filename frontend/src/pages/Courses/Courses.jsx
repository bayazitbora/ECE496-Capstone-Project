import { useState, useContext, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddCourseModal from "../../components/AddCourse/AddCourseModal";
import CreateCourseModal from "../../components/CreateCourse/CreateCourseModal";
import styles from "./Courses.module.css";
import { privateAxios, setPrivateAxiosToken } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { SignUpContext } from "../../context/SignUpContext";
import CourseCard from "../../components/Courses/CourseCard";

/**
 * Courses component handles the display and management of user courses.
 * It fetches user profiles, displays them, and allows adding new courses.
 */
function Courses() {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({
    courseCode: "",
    interests: [],
    availableTimes: [],
    hoursToCommit: 0,
    skills: [],
  });
  const { state: signUpState, dispatch } = useContext(SignUpContext);
  const { username, profiles: initialProfiles } = signUpState;
  const [profiles, setProfiles] = useState(initialProfiles || {});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  /**
   * Fetches user profiles on component mount.
   */
  useEffect(() => {
    const fetchProfiles = async () => {
      setPrivateAxiosToken(token);
      try {
        const response = await privateAxios.post("getSelf/", { username });
        const userData = response.data;
        setProfiles(userData.profiles);
        dispatch({ type: "SET_PROFILES", profiles: userData.profiles });
        console.log("User profiles:", userData.profiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, [username, dispatch, token]);

  /**
   * Advances to the next step in the course addition process.
   */
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * Goes back to the previous step in the course addition process.
   */
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Handles the form submission for adding a new course.
   * Sends the course data to the server and updates the user profiles.
   * @param {Event} event - The form submission event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submit button clicked");
    setFormState(formState);
    console.log(formState);

    try {
      const response = await privateAxios.post("updateProfile/", {
        username,
        profile: formState,
      });
      console.log("Profile created successfully:", response.data);

      const updatedProfilesResponse = await privateAxios.post("getSelf/", {
        username,
      });
      const updatedProfiles = updatedProfilesResponse.data;
      setProfiles(updatedProfiles.profiles);
      dispatch({ type: "SET_PROFILES", profiles: updatedProfiles.profiles });
      console.log("Updated profiles:", updatedProfiles.profiles);

      setFormState({
        courseCode: "",
        interests: [],
        availableTimes: [],
        hoursToCommit: 0,
        skills: [],
      });
      setCurrentStep(1);
    } catch (error) {
      console.error(error);
    }

    handleClose();
  };

  /**
   * Handles input changes for the course addition form.
   * @param {Event} event - The input change event.
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  /**
   * Handles the creation of a new course.
   * Sends the course data to the server and updates the user profiles.
   * @param {Object} courseData - The data of the new course.
   */
  const handleCreate = async (courseData) => {
    try {
      const response = await privateAxios.post(
        "http://127.0.0.1:8000/api/createCourse/",
        {
          courseInfo: {
            courseCode: courseData.courseCode,
            courseName: courseData.courseName,
            groupSize: courseData.groupSize,
          },
        }
      );
      console.log("Course created successfully:", response.data);

      const updatedProfilesResponse = await privateAxios.post("getSelf/", {
        username,
      });
      const updatedProfiles = updatedProfilesResponse.data;
      setProfiles(updatedProfiles.profiles);
      dispatch({ type: "SET_PROFILES", profiles: updatedProfiles.profiles });
      console.log("Updated profiles:", updatedProfiles.profiles);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className={styles.Container}>
        <h1>Courses</h1>
        {Object.keys(profiles).length === 0 && (
          <p>Add courses by pressing on the Add (+) button.</p>
        )}
        <div>
          {Object.keys(profiles).length > 0 ? (
            <Row>
              {Object.keys(profiles).map((courseCode) => (
                <Col sm="4" key={courseCode}>
                  <CourseCard
                    courseCode={courseCode}
                    profile={profiles[courseCode]}
                  />
                </Col>
              ))}
            </Row>
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
          <ModalHeader toggle={handleClose}>
            {signUpState.teacher == "False" ? "Add Course" : "Create Course"}
          </ModalHeader>
          <ModalBody>
            {signUpState.teacher == "False" ? (
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
            ) : (
              <CreateCourseModal
                handleOpen={handleOpen}
                handleClose={handleClose}
                handleCreate={handleCreate}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
}

export default Courses;
