import { useState } from "react";
import { Button, Form, FormGroup, Input } from "reactstrap";
import { privateAxios, setPrivateAxiosToken } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const ReviewForm = ({ reviewee, onReviewAdded }) => {
  const { token } = useAuth();
  const [comment, setComment] = useState("");

  const handleAddReview = async () => {
    if (comment) {
      try {
        setPrivateAxiosToken(token);
        await privateAxios.post("addReview/", {
          reviewee,
          score: 0,
          comment,
        });
        alert("Review added successfully!");
        setComment("");
        onReviewAdded();
      } catch (error) {
        console.error("Error adding review:", error);
        alert("Failed to add review.");
      }
    }
  };

  return (
    <Form>
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
        Submit Recommendation
      </Button>
    </Form>
  );
};

export default ReviewForm;
