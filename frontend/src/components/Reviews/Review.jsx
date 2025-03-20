import { Card, CardBody, CardTitle, CardText, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const Review = ({ review }) => {
  return (
    <Card
      className="mb-3"
      style={{ boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)" }}
    >
      <CardBody>
        <Row className="align-items-center mb-2">
          <Col xs="auto">
            {Array.from({ length: 5 }, (_, index) => (
              <FontAwesomeIcon
                key={index}
                icon={faStar}
                style={{ color: index < review.score ? "#ffc107" : "#e4e5e9" }}
              />
            ))}
          </Col>
          <Col xs="auto">
            <CardTitle tag="h6" className="mb-0">
              {review.reviewer}
            </CardTitle>
          </Col>
        </Row>
        <CardText className="mb-0">{review.review}</CardText>
        <CardText>{review.comment}</CardText>
      </CardBody>
    </Card>
  );
};

export default Review;
