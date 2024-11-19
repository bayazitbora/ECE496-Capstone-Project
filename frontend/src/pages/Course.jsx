import { useParams } from "react-router-dom";
import { useContext } from "react";
import { SignUpContext } from "../context/SignUpContext";

function Course(){
    const { courseCode } = useParams();
    const { state: signUpState } = useContext(SignUpContext);
    const { profiles } = signUpState;
    const profile = profiles ? profiles[courseCode] : null;

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
            {/* for debugging purposes */}
            {/* <pre>{JSON.stringify(signUpState, null, 2)}</pre> */}
        </div>
    );
}

export default Course;