import { useState } from "react";
import { ListGroupItem } from "reactstrap";

const MessageSent = ({ message }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ListGroupItem onClick={() => setIsOpen(!isOpen)}>
      <strong>{message.title}</strong> to {message.receiver} on{" "}
      {new Date(message.date).toLocaleString()}
      {isOpen && <p>{message.text}</p>}
    </ListGroupItem>
  );
};

export default MessageSent;
