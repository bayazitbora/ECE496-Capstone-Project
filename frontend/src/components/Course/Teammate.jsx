import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Row,
  Col,
} from "reactstrap";

const Teammate = ({ member, onMoreInfo }) => {
  const navigate = useNavigate();

  const handleSendMessage = () => {
    navigate("/contacts", { state: { receiver: member.username } });
  };

  return (
    <Card className="mb-3">
      <CardBody>
        <Row>
          <Col>
            <CardTitle tag="h5">
              {member.first_name} {member.last_name}
            </CardTitle>
            <CardText>Major: {member.pos}</CardText>
            <CardText>Graduation Year: {member.grad_year}</CardText>
          </Col>
          <Col className="d-flex justify-content-end align-items-center">
            <Button
              onClick={() => onMoreInfo(member)}
              color="primary"
              style={{ marginRight: "10px" }}
            >
              More Info
            </Button>
            <Button onClick={handleSendMessage} color="secondary">
              Send Message
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default Teammate;
