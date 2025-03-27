import { useContext, useEffect, useState } from "react";
import { SignUpContext } from "../../context/SignUpContext";
import styles from "./Profile.module.css";
import { privateAxios, setPrivateAxiosToken } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import OwnReview from "../../components/Reviews/OwnReview";

function Profile() {
  const { state: userState } = useContext(SignUpContext);
  const [reviews, setReviews] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setPrivateAxiosToken(token);
        const response = await privateAxios.get("getReviews/", {
          params: { username: userState.username },
        });
        setReviews(response.data.reviews);
        console.log("Reviews:", response.data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [userState.username, token]);

  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmDelete) return;

    try {
      setPrivateAxiosToken(token);
      await privateAxios.delete("deleteReview/", {
        data: { review_id: reviewId },
      });
      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <>
      <div className={styles.Container}>
        <h1>
          {userState.first_name} {userState.last_name}
        </h1>
        <div style={{ marginBottom: "20px" }}>
          <p>
            <strong>Role: </strong>
            {userState.teacher === "False" ? "Student" : "Instructor"}
          </p>
          {userState.teacher === "True" && (
            <p>
              <strong>Title:</strong> {userState.title}
            </p>
          )}
          <p>
            <strong>Username:</strong> {userState.username}
          </p>
          <p>
            <strong>Email:</strong> {userState.email}
          </p>
          {userState.teacher === "False" && (
            <>
              <p>
                <strong>Program of Study:</strong> {userState.pos}
              </p>
              <p>
                <strong>Graduation Year:</strong> {userState.grad_year}
              </p>
              <p>
                <strong>Minors:</strong> {userState.minors.join(", ")}
              </p>
              <p>
                <strong>GPA:</strong> {userState.gpa}
              </p>
            </>
          )}
          <p>
            <strong>About Me:</strong> {userState.bio}
          </p>
        </div>
        <div>
          <h2>Recommendations</h2>
          {reviews.length === 0 ? (
            <p>No recommendations available.</p>
          ) : (
            reviews.map((review) => (
              <OwnReview
                key={review.id}
                review={review}
                onDelete={handleDeleteReview}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
