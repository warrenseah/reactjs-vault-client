import { Fragment } from "react";
import { Modal, Button } from "react-bootstrap";
import ReactDOM from "react-dom";

const AlertModal = (props) => {
  return (
    <Modal show={props.onShow} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ModalWindow = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <AlertModal
          title={props.title}
          body={props.body}
          onShow={props.onShow}
          onHide={props.onHide}
        />,
        document.getElementById("modal-root")
      )}
    </Fragment>
  );
};

export default ModalWindow;
