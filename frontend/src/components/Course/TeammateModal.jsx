import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { privateAxios, setPrivateAxiosToken } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import Review from "../Reviews/Review";
import ReviewForm from "./ReviewForm";

const TeammateModal = ({ isOpen, toggle, teammate }) => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const navigate = useNavigate();

  const fetchReviews = async () => {
    if (teammate && isOpen) {
      setPrivateAxiosToken(token);
      try {
        const response = await privateAxios.get("getReviews/", {
          params: { username: teammate.username },
        });
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [teammate, isOpen, token]);

  const handleReviewAdded = () => {
    setShowReviewForm(false);
    fetchReviews();
  };

  const handleSendMessage = () => {
    navigate("/contacts", { state: { receiver: teammate.username } });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-lg wider-modal">
      <ModalHeader toggle={toggle}>
        {teammate.first_name} {teammate.last_name}
      </ModalHeader>
      <ModalBody>
        <p>
          <strong>Major:</strong> {teammate.pos}
        </p>
        <p>
          <strong>Graduation Year:</strong> {teammate.grad_year}
        </p>
        <p>
          <strong>Minors:</strong> {teammate.minors.join(", ")}
        </p>
        <h5>Reviews</h5>
        {reviews.length > 0 ? (
          reviews.map((review) => <Review key={review.id} review={review} />)
        ) : (
          <p>No reviews available.</p>
        )}
        {showReviewForm && (
          <ReviewForm
            reviewee={teammate.username}
            onReviewAdded={handleReviewAdded}
          />
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

export default TeammateModal;
