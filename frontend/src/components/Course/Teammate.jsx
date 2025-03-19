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
            <Button onClick={() => onMoreInfo(member)} color="primary">
              More Info
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default Teammate;
