import { useEffect, useState } from "react";
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
} from "reactstrap";
import { privateAxios, setPrivateAxiosToken } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import Review from "../Reviews/Review";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const TeammateModal = ({ isOpen, toggle, teammate }) => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
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

    fetchReviews();
  }, [teammate, isOpen, token]);

  const handleAddReview = async () => {
    if (score && comment) {
      try {
        setPrivateAxiosToken(token);
        await privateAxios.post("addReview/", {
          reviewee: teammate.username,
          score,
          comment,
        });
        alert("Review added successfully!");
        setShowReviewForm(false);
        setScore(0);
        setComment("");
      } catch (error) {
        console.error("Error adding review:", error);
        alert("Failed to add review.");
      }
    }
  };

  const handleStarClick = (index) => {
    setScore(index + 1);
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
          <Form>
            <FormGroup>
              <Label for="score">Score</Label>
              <div>
                {Array.from({ length: 5 }, (_, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={faStar}
                    style={{
                      color: index < score ? "#ffc107" : "#e4e5e9",
                      cursor: "pointer",
                    }}
                    onClick={() => handleStarClick(index)}
                  />
                ))}
              </div>
            </FormGroup>
            <FormGroup>
              <Input
                type="textarea"
                name="comment"
                placeholder="Comment"
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </FormGroup>
            <Button color="success" onClick={handleAddReview}>
              Submit Review
            </Button>
          </Form>
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
        <Button color="primary" href={`mailto:${teammate.email}`}>
          Email
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TeammateModal;
