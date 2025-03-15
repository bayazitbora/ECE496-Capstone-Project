import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const TeammateModal = ({ isOpen, toggle, teammate }) => {
    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>{teammate.first_name} {teammate.last_name}</ModalHeader>
            <ModalBody>
                <p><strong>Major:</strong> {teammate.pos}</p>
                <p><strong>Graduation Year:</strong> {teammate.grad_year}</p>
                <p><strong>Minors:</strong> {teammate.minors.join(", ")}</p>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Close</Button>
                <Button color="primary" href={`mailto:${teammate.email}`}>Email</Button>
            </ModalFooter>
        </Modal>
    );
};

export default TeammateModal;