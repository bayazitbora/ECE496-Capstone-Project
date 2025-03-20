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
    // TODO: remove this and fetch team from backend later
    const sampleUsernames = ["joao.bicalho", "isabelle.noa", "user3", "user4"];
    const fetchTeammates = async () => {
      setPrivateAxiosToken(token);
      try {
        const users = await Promise.all(
          sampleUsernames.map(async (requested_user) => {
            const response = await privateAxios.post("getUser/", {
              requested_user,
            });
            return response.data;
          })
        );
        setTeammates(users);
        console.log("Teammates:", users);
      } catch (error) {
        console.error("Error fetching teammates:", error);
      }
    };
    fetchTeammates();
  }, [token]);

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
          <p>No teammates available.</p>
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
