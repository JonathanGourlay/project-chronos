import React from "react";
import { Button, Modal, Form } from "react-bootstrap";
// import { State } from "../Scripts/GlobalState";
// import { State } from "../Scripts/GlobalState";

import { Column } from "./KanBanBoard";

interface IHandlerProps {
  setColumnModalVisible: (show: boolean) => void;
  columnModalVisible: boolean | undefined;
  addColumn: (index: number, form: Column) => void;
  columnIndex: number;
  // setColumnState: React.Dispatch<React.SetStateAction<number>>;
}

// Add Card Modal  Component
const AddColumnModal = (props: IHandlerProps) => {
  // Global State Variables
  // let { state, setState, getItems, setCardModalVisible } = State.useContainer();
  const {
    columnModalVisible,
    setColumnModalVisible,
    columnIndex,
    addColumn,
  } = props;

  const [formState, setFormState] = React.useState<Column>({
    id: "",
    title: "",
    cards: [],
  });

  return (
    <>
      <Modal show={columnModalVisible}>
        <Modal.Header>
          <Modal.Title>Add Column</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            onSubmit={(e) => {
              // API Create Call - remove prevent default when api call in place
              e.preventDefault();
              // Clone state to modify
              const newState = formState;
              // Set stateClone.id to cardId
              newState.id = `${columnIndex}`;
              // Set formState to new modified state
              setFormState(newState);
              // Run add Item function
              //   addItemToColumn(columnIndex, formState);
              addColumn(columnIndex, formState);
              //   setColumnState(0);
              // Set modalVisible to false
              setColumnModalVisible(false);
            }}
          >
            <Form.Group controlId={`${columnIndex}`}>
              <Form.Control type="string" value={columnIndex} disabled={true} />
            </Form.Group>
            <Form.Group controlId={`formBasicName ${columnIndex}`}>
              <Form.Control
                required={true}
                type="name"
                placeholder="Column Name"
                onChange={(i) => {
                  // Clone state to modify
                  const newState = formState;
                  // Set stateClone.tite to target value
                  newState.title = i.target.value;
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
              setColumnModalVisible(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AddColumnModal;
