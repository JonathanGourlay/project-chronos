import React from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { ColumnDto } from "../API/client/client";
// import { State } from "../Scripts/GlobalState";
// import { State } from "../Scripts/GlobalState";

import { stateObject } from "./KanBanBoard";

interface IHandlerProps {
  setState: (
    patch:
      | Partial<stateObject>
      | ((prevState: stateObject) => Partial<stateObject>)
  ) => void;
  //setColumnModalVisible: (show: boolean) => void;
  columnModalVisible: boolean | undefined;
  addColumn: (index: number, form: ColumnDto) => void;
  columnIndex: number;
  // setColumnState: React.Dispatch<React.SetStateAction<number>>;
}

// Add Card Modal  Component
const AddColumnModal = (props: IHandlerProps) => {
  // Global State Variables
  // let { state, setState, getItems, setCardModalVisible } = State.useContainer();
  const { columnModalVisible, setState, columnIndex, addColumn } = props;

  const [formState, setFormState] = React.useState<ColumnDto>();

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
              let newState = formState;
              // Set stateClone.id to cardId
              if (newState) {
                newState.columnId = columnIndex + 1;
                newState.tasks = [];
              } else {
                newState = new ColumnDto();
              }
              // Set formState to new modified state
              setFormState(newState);
              // Run add Item function
              addColumn(columnIndex, newState);
              // Set modalVisible to false
              setState({ columnModalVisible: false });
            }}
          >
            <Form.Group controlId={`${columnIndex + 1}`}>
              <Form.Control
                type="string"
                value={columnIndex + 1}
                disabled={true}
              />
            </Form.Group>
            <Form.Group controlId={`formBasicName ${columnIndex}`}>
              <Form.Control
                required={true}
                type="name"
                placeholder="Column Name"
                onChange={(i) => {
                  // Clone state to modify
                  const newState = { ...formState };
                  // Set stateClone.tite to target value
                  newState.columnName = i.target.value;
                  setFormState(newState as ColumnDto);
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
              setState({ columnModalVisible: false });
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
