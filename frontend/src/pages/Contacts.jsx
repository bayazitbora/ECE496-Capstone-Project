import { useState, useEffect } from "react";
import axios from "axios";
import { Button, ListGroup, Nav, NavItem, NavLink } from "reactstrap";
import MessageSent from "../components/Contacts/MessageSent";
import MessageReceived from "../components/Contacts/MessageReceived";
import MessageModal from "../components/Contacts/MessageModal";

function Contacts() {
  const [messages, setMessages] = useState({
    received_messages: [],
    sent_messages: [],
  });
  const [newMessage, setNewMessage] = useState({
    receiver: "",
    title: "",
    text: "",
  });
  const [token] = useState(localStorage.getItem("token"));
  const [activeTab, setActiveTab] = useState("received");
  const [modal, setModal] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/getMessages/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/sendMessage/", newMessage, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMessages();
      setNewMessage({ receiver: "", title: "", text: "" });
      toggleModal();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete("http://127.0.0.1:8000/api/deleteMessage/", {
        headers: { Authorization: `Bearer ${token}` },
        data: { message_id: messageId },
      });
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const toggleModal = () => setModal(!modal);

  return (
    <div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={activeTab === "received" ? "active" : ""}
            onClick={() => setActiveTab("received")}
          >
            Received Messages
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === "sent" ? "active" : ""}
            onClick={() => setActiveTab("sent")}
          >
            Sent Messages
          </NavLink>
        </NavItem>
        <NavItem>
          <Button
            color="primary"
            onClick={toggleModal}
            style={{ marginLeft: "10px" }}
          >
            Send a Message
          </Button>
        </NavItem>
      </Nav>
      {activeTab === "received" && (
        <div>
          <ListGroup>
            {messages.received_messages.map((msg) => (
              <MessageReceived
                key={msg.id}
                message={msg}
                onDelete={handleDeleteMessage}
              />
            ))}
          </ListGroup>
        </div>
      )}
      {activeTab === "sent" && (
        <div>
          <ListGroup>
            {messages.sent_messages.map((msg) => (
              <MessageSent key={msg.id} message={msg} />
            ))}
          </ListGroup>
        </div>
      )}
      <MessageModal
        isOpen={modal}
        toggle={toggleModal}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default Contacts;
