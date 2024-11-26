
function TeammateCard({ member }) {
    return (
        <div className="teammate-card">
            <h3>{member.first_name} {member.last_name}</h3>
            <p>Username: {member.requested_user}</p>
            <p>Email: {member.email}</p>
            <p>Position: {member.pos}</p>
            <p>Graduation Year: {member.grad_year}</p>
            <p>Minors: {member.minors.join(", ")}</p>
        </div>
    );
}

export default TeammateCard;