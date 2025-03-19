import Review from "./Review";

const reviewsList = ({ reviews }) => {
  if (reviews.length === 0) {
    return <div style={{ padding: "20px 0" }}>No reviews yet.</div>;
  }

  return (
    <div>
      {reviews.map((review) => (
        <Review key={review.id} review={review} />
      ))}
    </div>
  );
};

export default reviewsList;
