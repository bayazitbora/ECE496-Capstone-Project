import { useParams } from "react-router-dom";

function Course(){
    const { courseCode } = useParams();
    return(<h1>{courseCode}</h1>);
}

export default Course;