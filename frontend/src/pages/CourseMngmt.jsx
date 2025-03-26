import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { privateAxios, setPrivateAxiosToken } from "../api/api";
import { useAuth } from "../context/AuthContext";
import StudentRow from "../components/Course/StudentRow";
import StudentModal from "../components/Course/StudentModal";

/**
 * CourseMngmt component allows instructors to manage a specific course.
 * It fetches the course data from the server and displays it.
 */
function CourseMngmt() {
  const { token } = useAuth();
  const { courseCode } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [students, setStudents] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      setPrivateAxiosToken(token);
      try {
        const response = await privateAxios.post("listUserCourses/", {});
        const courses = response.data.courses;
        setCourseData(courses[courseCode]);
        console.log("Course data:", courses[courseCode]);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    const fetchStudents = async () => {
      setPrivateAxiosToken(token);
      try {
        const response = await privateAxios.post("listUsersInCourse/", {
          courseCode,
        });
        setStudents(response.data);
        console.log("Students data:", response.data);
      } catch (error) {
        console.error("Error fetching students data:", error);
      }
    };

    fetchCourseData();
    fetchStudents();
  }, [token, courseCode]);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  return (
    <div>
      <h1>Manage Course: {courseCode}</h1>
      {courseData ? (
        <div>
          <p>Course Name: {courseData.courseName}</p>
          <p>Description: {courseData.description}</p>
          <p>Session: {courseData.session}</p>
          <p>Year: {courseData.year}</p>
          <p>Group Size: {courseData.groupSize}</p>
          {/* Add more course management functionalities here */}
        </div>
      ) : (
        <p>Loading course data...</p>
      )}
      {students ? (
        <div>
          <h2>Students ({students.studentsUsername.length})</h2>
          <ul>
            {students.studentsUsername.map((student, index) => (
              <StudentRow
                key={index}
                username={student}
                email={students.studentsEmail[index]}
                onViewDetails={() => handleViewDetails(student)}
              />
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading students data...</p>
      )}
      {selectedStudent && (
        <StudentModal
          isOpen={modalOpen}
          toggle={() => setModalOpen(!modalOpen)}
          student={selectedStudent}
          courseCode={courseCode}
        />
      )}
    </div>
  );
}

export default CourseMngmt;
