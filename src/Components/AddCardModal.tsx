import React from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { State, BoardCard } from "../Scripts/GlobalState";
import { ICardProps } from "./CardComponent";

interface IHandlerProps {
  //   boardCard: BoardCard;
  columnIndex: number;
  cardModalVisible: boolean | undefined;
  setCardModalVisible: (show: boolean) => void;
}

interface IBoardCardProps {
  id: number;
  title: string;
  comments: string;
}
const AddCardModal = (props: IHandlerProps) => {
  // console.log(props.columnIndex);
  //   let modalVisible: boolean | undefined = true;
  const [formState, setFormState] = React.useState<BoardCard>({
    id: "change me",
    comments: "change me",
    title: "change me",
  });

  let {
    state,
    setState,
    reorder,
    move,
    getItems,
    setCardModalVisible,
    cardModalVisible,
  } = State.useContainer();

  const addItemToColumn = () => {
    const stateClone = Array.from(state);
    stateClone[props.columnIndex].push(getItems(1, formState)[0]);
    setState(stateClone);
  };

  // console.log(state.length);

  return (
    <>
      <Modal show={props.cardModalVisible}>
        <Modal.Header>
          <Modal.Title>Add Card</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            onSubmit={(e) => {
              // API Create Call - remove prevent default when api call in place
              e.preventDefault();
              addItemToColumn();
              setCardModalVisible(false);
            }}
          >
            <Form.Group controlId="formBasicID">
              <Form.Control
                type="number"
                value={
                  state[props.columnIndex] ? state[props.columnIndex].length : 0
                }
                disabled={true}
              />
            </Form.Group>
            <Form.Group controlId="formBasicName">
              <Form.Control
                required={true}
                type="name"
                placeholder="Card Name"
                onChange={(i) => {
                  const newState = formState;
                  // const newState = formState
                  newState.title = i.target.value;
                  setFormState(newState);
                }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicName">
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
