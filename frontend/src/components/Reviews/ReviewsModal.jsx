import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import createReview from "../../api/createReview";

function ReviewsModal({ isOpen, toggle, reviewerId, revieweeId }) {
  const [review, setreview] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleStarClick = (index) => {
    setreview(index + 1);
  };

  const handleSubmit = () => {
    const newReview = {
      review: review,
      description: reviewText,
      reviewer_id: reviewerId,
      reviewee_id: revieweeId,
    };
    createReview(newReview)
      .then(() => {
        toggle();
      })
      .catch((error) => {
        console.error("Error creating review:", error.message);
      });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Leave a Review</ModalHeader>
      <ModalBody>
        <div className="star-review d-flex align-items-center mb-3">
          {Array.from({ length: 5 }, (_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={faStar}
              onClick={() => handleStarClick(index)}
              style={{
                cursor: "pointer",
                color: index < review ? "#ffc107" : "#e4e5e9",
                fontSize: "1.5rem",
                marginRight: "0.2rem",
              }}
            />
          ))}
        </div>
        <Input
          type="textarea"
          placeholder="Write your review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          maxLength={1000}
        />
      </ModalBody>
      <ModalFooter>
        <Button className="button" onClick={handleSubmit}>
          Submit
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ReviewsModal;
