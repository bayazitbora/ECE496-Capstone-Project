import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { SignUpContext } from "../context/SignUpContext";
import TeammateCard from "../components/Course/TeammateCard";
import { getUser } from "../api/api";
import { useAuth } from "../context/AuthContext";

function Course(){
    const { token } = useAuth();
    const { courseCode } = useParams();
    const { state: signUpState } = useContext(SignUpContext);
    const { profiles } = signUpState;
    const profile = profiles ? profiles[courseCode] : null;
    const [teammates, setTeammates] = useState([]);

    useEffect(() => {
        // TODO: remove this and fetch team from backend later
        const sampleUsernames = ["user1", "user2", "user3", "test1111"];
        const fetchTeammates = async () => {
            const users = await Promise.all(sampleUsernames.map(requested_user => getUser({ requested_user }, token)));
            setTeammates(users);
            console.log("Teammates:", users);
        };
        fetchTeammates();
    }, []);

    return(
        <div>
            <h1>{courseCode}</h1>
            {profile ? (
                <div>
                    <p>Interests: {profile.interests ? profile.interests.map(i => i.interest).join(", ") : "N/A"}</p>
                    <p>Available Times: {profile.availableTimes ? profile.availableTimes.join(", ") : "N/A"}</p>
                    <p>Hours to Commit: {profile.hoursToCommit ?? "N/A"}</p>
                    <p>Skills: {profile.skills ? profile.skills.map(s => s.skill).join(", ") : "N/A"}</p>
                </div>
            ) : (
                <p>No profile data available.</p>
            )}
            <div>
                <h2>Teammates</h2>
                {teammates.length > 0 ? (
                    teammates.map(member => (
                        <TeammateCard key={member.username} member={member} />
                    ))
                ) : (
                    <p>No teammates available.</p>
                )}
            </div>
            {/* for debugging purposes */}
            {/* <pre>{JSON.stringify(signUpState, null, 2)}</pre> */}
        </div>
    );
}

export default Course;