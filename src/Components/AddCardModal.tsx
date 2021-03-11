import React from "react";
import { Button, Modal, Form } from "react-bootstrap";
// import { State } from "../Scripts/GlobalState";
// import { State } from "../Scripts/GlobalState";

import { BoardCard } from "./KanBanTemp";

// Modal Props
interface IHandlerProps {
  columnIndex: number;
  cardModalVisible: boolean | undefined;
  setCardModalVisible: (show: boolean) => void;
  addItemToColumn: (index: number, form: BoardCard) => void;
  cardId: string;
  // formState: BoardCard;
  // setFormState: React.Dispatch<React.SetStateAction<BoardCard>>;
  setColumnState: React.Dispatch<React.SetStateAction<number>>;
}

// Add Card Modal  Component
const AddCardModal = (props: IHandlerProps) => {
  // Global State Variables
  // let { state, setState, getItems, setCardModalVisible } = State.useContainer();
  const {
    // setFormState,
    cardId,
    // formState,
    addItemToColumn,
    setCardModalVisible,
    columnIndex,
    setColumnState,
  } = props;
  const [formState, setFormState] = React.useState<BoardCard>({
    id: "",
    comments: "",
    title: "",
  });
  return (
    <>
      <Modal show={props.cardModalVisible}>
        <Modal.Header>
          <Modal.Title>Add Card</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            // onLoad={() => {
            //   // Clone state to modify
            //   const newState = formState;
            //   // Set stateClone.id to cardId
            //   newState.id = cardId;
            //   // Set formState to new modified state
            //   setFormState(newState);
            // }}
            onSubmit={(e) => {
              // API Create Call - remove prevent default when api call in place
              e.preventDefault();
              // Clone state to modify
              const newState = formState;
              // Set stateClone.id to cardId
              newState.id = cardId;
              // Set formState to new modified state
              setFormState(newState);
              // Run add Item function
              addItemToColumn(columnIndex, formState);
              setColumnState(0);
              // Set modalVisible to false
              setCardModalVisible(false);
            }}
          >
            <Form.Group controlId={cardId}>
              <Form.Control type="string" value={cardId} disabled={true} />
            </Form.Group>
            <Form.Group controlId={`formBasicName ${cardId}`}>
              <Form.Control
                required={true}
                type="name"
                placeholder="Card Name"
                onChange={(i) => {
                  // Clone state to modify
                  const newState = formState;
                  // Set stateClone.tite to target value
                  newState.title = i.target.value;
                  setFormState(newState);
                }}
              />
            </Form.Group>
            <Form.Group controlId={`formBasicComments ${cardId}`}>
              <Form.Control
                required={true}
                type="comments"
                placeholder="Comments"
                onChange={(i) => {
                  const newState = formState;
                  // const newState = formState
                  newState.comments = i.target.value;
                  setFormState(newState);
                }}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              props.setCardModalVisible(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AddCardModal;
