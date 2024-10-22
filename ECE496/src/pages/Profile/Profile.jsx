import { useContext } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { SignUpContext } from "../../context/SignUpContext";
import styles from "./Profile.module.css";

function Profile() {
  const { state: userProfile } = useContext(SignUpContext); // Access user profile data

  return (
    <>
      <Navbar />
      <div className={styles.Container}>
        <h1>
          {userProfile.first_name} {userProfile.last_name}
        </h1>
        <div style={{ marginBottom: "20px" }}>
          <p>
            <strong>Role:</strong> {userProfile.role}
          </p>
          <p>
            <strong>Username:</strong> {userProfile.username}
          </p>
          <p>
            <strong>Email:</strong> {userProfile.email}
          </p>
          <p>
            <strong>Program of Study:</strong> {userProfile.pos}
          </p>
          <p>
            <strong>Graduation Year:</strong> {userProfile.grad_year}
          </p>
          <p>
            <strong>Minors:</strong> {userProfile.minors.join(", ")}
          </p>
          <p>
            <strong>GPA:</strong> {userProfile.gpa}
          </p>
        </div>
      </div>
    </>
  );
}

export default Profile;
