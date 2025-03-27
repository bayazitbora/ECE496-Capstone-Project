import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { privateAxios, setPrivateAxiosToken } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import Review from "../Reviews/Review";
import ReviewForm from "./ReviewForm";

const StudentModal = ({ isOpen, toggle, student, courseCode }) => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const fetchReviews = async () => {
    if (student && isOpen) {
      setPrivateAxiosToken(token);
      try {
        const response = await privateAxios.get("getReviews/", {
          params: { username: student },
        });
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
  };

  const fetchUserData = async () => {
    if (student && isOpen) {
      setPrivateAxiosToken(token);
      try {
        const response = await privateAxios.post("getUser/", {
          requested_user: student,
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchUserData();
  }, [student, isOpen, token]);

  const handleReviewAdded = () => {
    setShowReviewForm(false);
    fetchReviews();
  };

  const handleSendMessage = () => {
    navigate("/contacts", { state: { receiver: student } });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-lg wider-modal">
      <ModalHeader toggle={toggle}>
        {userData
          ? `${userData.first_name} ${userData.last_name}`
          : "Loading..."}
      </ModalHeader>
      <ModalBody>
        {userData ? (
          <div>
            <p>
              <strong>Username:</strong> {userData.username}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Major:</strong> {userData.pos}
            </p>
            <p>
              <strong>Graduation Year:</strong> {userData.grad_year}
            </p>
            <p>
              <strong>Minors:</strong> {userData.minors.join(", ")}
            </p>
            <p>
              <strong>Bio:</strong> {userData.bio || "N/A"}
            </p>
            <h5>Profile for {courseCode}</h5>
            {userData.profiles[courseCode] ? (
              <div>
                <p>
                  <strong>Hours to Commit:</strong>{" "}
                  {userData.profiles[courseCode].hoursToCommit}
                </p>
                <p>
                  <strong>Interests:</strong>{" "}
                  {userData.profiles[courseCode].interests
                    .map((interest) => interest.interest)
                    .join(", ")}
                </p>
                <p>
                  <strong>Skills:</strong>{" "}
                  {userData.profiles[courseCode].skills
                    .map((skill) => skill.skill)
                    .join(", ")}
                </p>
              </div>
            ) : (
              <p>No profile available for this course.</p>
            )}
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
        <h5>Recommendations</h5>
        {reviews.length > 0 ? (
          reviews.map((review) => <Review key={review.id} review={review} />)
        ) : (
          <p>No recommendations available.</p>
        )}
        {showReviewForm && (
          <ReviewForm reviewee={student} onReviewAdded={handleReviewAdded} />
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
        <Button
          color="primary"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          Write Review
        </Button>
        <Button color="primary" onClick={handleSendMessage}>
          Send Message
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default StudentModal;
