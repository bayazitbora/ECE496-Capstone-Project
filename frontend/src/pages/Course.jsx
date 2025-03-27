import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { SignUpContext } from "../context/SignUpContext";
import { privateAxios, setPrivateAxiosToken } from "../api/api";
import TeammateModal from "../components/Course/TeammateModal";
import Teammate from "../components/Course/Teammate";
import { useAuth } from "../context/AuthContext";

/**
 * Course component displays the details of a specific course and its teammates.
 * It fetches the teammates' data from the server and displays it.
 */
function Course() {
  const { token } = useAuth();
  const { courseCode } = useParams();
  const { state: signUpState } = useContext(SignUpContext);
  const { profiles } = signUpState;
  const profile = profiles ? profiles[courseCode] : null;
  const [teammates, setTeammates] = useState([]);
  const [selectedTeammate, setSelectedTeammate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!modalOpen);

  /**
   * Fetches teammates' data on component mount.
   */
  useEffect(() => {
    const fetchTeammates = async () => {
      setPrivateAxiosToken(token);
      try {
        // Fetch user data using getSelf/
        const response = await privateAxios.post("getSelf/");
        const userData = response.data;

        // Extract matchedUsers for the current course
        const matchedUsers =
          userData.profiles && userData.profiles[courseCode]
            ? userData.profiles[courseCode].matchedUsers
            : [];

        // Fetch detailed data for each matched user
        const users = await Promise.all(
          matchedUsers.map(async (matchedUser) => {
            const userResponse = await privateAxios.post("getUser/", {
              requested_user: matchedUser.username,
            });
            return userResponse.data;
          })
        );

        setTeammates(users);
        console.log("Teammates:", users);
      } catch (error) {
        console.error("Error fetching teammates:", error);
      }
    };

    fetchTeammates();
  }, [token, courseCode]);

  return (
    <div>
      <h1>{courseCode}</h1>
      {profile ? (
        <div>
          <p>
            Interests:{" "}
            {profile.interests
              ? profile.interests.map((i) => i.interest).join(", ")
              : "N/A"}
          </p>
          <p>
            Available Times:{" "}
            {profile.availableTimes ? profile.availableTimes.join(", ") : "N/A"}
          </p>
          <p>Hours to Commit: {profile.hoursToCommit ?? "N/A"}</p>
          <p>
            Skills:{" "}
            {profile.skills
              ? profile.skills.map((s) => s.skill).join(", ")
              : "N/A"}
          </p>
        </div>
      ) : (
        <p>No profile data available.</p>
      )}
      <div>
        <h2>Teammates</h2>
        {teammates.length > 0 ? (
          teammates.map((member) => (
            <Teammate
              key={member.username}
              member={member}
              onMoreInfo={(member) => {
                setSelectedTeammate(member);
                toggleModal();
              }}
            />
          ))
        ) : (
          <p>Team matching has not occurred yet for this course.</p>
        )}
      </div>
      {selectedTeammate && (
        <TeammateModal
          isOpen={modalOpen}
          toggle={toggleModal}
          teammate={selectedTeammate}
        />
      )}
    </div>
  );
}

export default Course;
