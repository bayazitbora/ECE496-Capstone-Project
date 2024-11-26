import { Card, CardBody, CardTitle, CardText, Button, CardImg } from 'reactstrap';
import defaultImage from '../../assets/ECE496.jpg';

function CourseCard({ courseCode, imageUrl = defaultImage }) {
  return (
    <Card key={courseCode} className="mb-3" style={{ width: '22rem', height: '25rem' }}>
      <CardImg top width="100%" src={imageUrl} alt={`${courseCode} image`} style={{ objectFit: 'cover', height: '200px' }} />
      <CardBody>
        <CardTitle tag="h5">{courseCode}</CardTitle>
        <CardText>
          <Button color="primary" href={`/course/${courseCode}`}>
            More Details
          </Button>
        </CardText>
      </CardBody>
    </Card>
  );
}

export default CourseCard;