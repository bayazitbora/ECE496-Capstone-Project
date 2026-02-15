import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Row,
  Col,
  Button,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const OwnReview = ({ review, onDelete }) => {
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
          <Col className="d-flex justify-content-end align-items-center">
            <Button
              color="danger"
              size="sm"
              onClick={() => onDelete(review.id)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </Col>
        </Row>
        <CardText className="mb-0">{review.review}</CardText>
        <CardText>{review.comment}</CardText>
      </CardBody>
    </Card>
  );
};

export default OwnReview;
