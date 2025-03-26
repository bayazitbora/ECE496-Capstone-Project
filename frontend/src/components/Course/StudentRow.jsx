import { useNavigate } from "react-router-dom";
import { Button, ListGroupItem, Row, Col } from "reactstrap";

const StudentRow = ({ username, email, onViewDetails }) => {
  const navigate = useNavigate();

  const handleSendMessage = () => {
    navigate("/contacts", { state: { receiver: username } });
  };

  return (
    <ListGroupItem>
      <Row className="align-items-center">
        <Col>{email}</Col>
        <Col className="text-end">
          <Button color="primary" onClick={handleSendMessage} className="me-2">
            Message
          </Button>
          <Button color="secondary" onClick={onViewDetails}>
            View Details
          </Button>
        </Col>
      </Row>
    </ListGroupItem>
  );
};

export default StudentRow;
