import {
  Button,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

const MessageModal = ({
  isOpen,
  toggle,
  newMessage,
  setNewMessage,
  handleSendMessage,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Send a Message</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSendMessage}>
          <FormGroup>
            <Input
              type="text"
              name="receiver"
              placeholder="To"
              id="receiver"
              value={newMessage.receiver}
              onChange={(e) =>
                setNewMessage({ ...newMessage, receiver: e.target.value })
              }
              required
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="text"
              name="title"
              placeholder="Title"
              id="title"
              value={newMessage.title}
              onChange={(e) =>
                setNewMessage({ ...newMessage, title: e.target.value })
              }
              required
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="textarea"
              name="text"
              placeholder="Message"
              id="text"
              value={newMessage.text}
              onChange={(e) =>
                setNewMessage({ ...newMessage, text: e.target.value })
              }
              required
              style={{ height: "200px" }} // Increase the height of the textarea
            />
          </FormGroup>
          <ModalFooter>
            <Button type="submit" color="primary">
              Send
            </Button>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default MessageModal;
