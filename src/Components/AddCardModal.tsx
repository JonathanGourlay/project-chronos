import React from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { State, BoardCard } from "../Scripts/GlobalState";
import { ICardProps } from "./CardComponent";

interface IHandlerProps {
  //   boardCard: BoardCard;
  cardModalVisible: boolean | undefined;
  setCardModalVisible: (show: boolean) => void;
}

interface IBoardCardProps {
  id: number;
  title: string;
  comments: string;
}
const AddCardModal = (props: IHandlerProps) => {
  //   let modalVisible: boolean | undefined = true;
  const [formState, setFormState] = React.useState<BoardCard>();

  return (
    <>
      <Modal show={props.cardModalVisible}>
        <Modal.Header>
          <Modal.Title>Add Card</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* <Form onSubmit={() => {}}>
            <Form.Group controlId="formBasicName">
              <Form.Control
                required={true}
                type="name"
                placeholder="Card Name"
                onChange={(i) => {
                    const newState = formState??  {
                     }<BoardCard>
                    newState.card.title = i.target.value;

                    setFormState(...formState formState?.card.title = i.target.value;)
                }}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form> */}
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
