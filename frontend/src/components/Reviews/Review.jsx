import { Card, CardBody, CardTitle, CardText, Row, Col } from "reactstrap";

const Review = ({ review }) => {
  return (
    <Card
      className="mb-3"
      style={{ boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)" }}
    >
      <CardBody>
        <Row className="align-items-center mb-2">
          <Col xs="auto">
            <CardTitle tag="h6" className="mb-0">
              From: {review.reviewer}
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
