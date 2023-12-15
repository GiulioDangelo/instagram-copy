import {useState} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function Modale({deleteItem, item}) {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<>
			<Button variant="danger" onClick={handleShow}>
				{`Delete ${item}`}
			</Button>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Delete {item}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Are you sure you want to delete your {item}? This action cannot be
					undone, and all information associated with your {item} will be lost.
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="danger" onClick={deleteItem}>
						Delete {item}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default Modale;
