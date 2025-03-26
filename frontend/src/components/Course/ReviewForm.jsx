import { useState } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { privateAxios, setPrivateAxiosToken } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const ReviewForm = ({ reviewee, onReviewAdded }) => {
  const { token } = useAuth();
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");

  const handleAddReview = async () => {
    if (score && comment) {
      try {
        setPrivateAxiosToken(token);
        await privateAxios.post("addReview/", {
          reviewee,
          score,
          comment,
        });
        alert("Review added successfully!");
        setScore(0);
        setComment("");
        onReviewAdded();
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
  );
};

export default ReviewForm;
