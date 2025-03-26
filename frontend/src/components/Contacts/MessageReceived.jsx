import { useState } from "react";
import { ListGroupItem, Button } from "reactstrap";

const MessageReceived = ({ message, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ListGroupItem onClick={() => setIsOpen(!isOpen)}>
      <strong>{message.title}</strong> from {message.sender} on{" "}
      {new Date(message.date).toLocaleString()}
      {isOpen && (
        <>
          <p>{message.text}</p>
          <Button color="danger" onClick={() => onDelete(message.id)}>
            Delete
          </Button>
        </>
      )}
    </ListGroupItem>
  );
};

export default MessageReceived;
