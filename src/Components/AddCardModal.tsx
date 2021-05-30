import React from "react";
import { Button, Modal, Form, Toast } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
// import { State } from "../Scripts/GlobalState";
// import { State } from "../Scripts/GlobalState";
import { createReducerContext, useSetState } from "react-use";
import { BoardCard, stateObject } from "./KanBanBoard";

// Modal Props
interface IHandlerProps {
  columnIndex: number;
  cardModalVisible: boolean | undefined;
  setState: (
    patch:
      | Partial<stateObject>
      | ((prevState: stateObject) => Partial<stateObject>)
  ) => void;
  addItemToColumn: (index: number, form: BoardCard) => void;
  cardId: number;
  projectStartTime: Date;
}

// Add Card Modal  Component
const AddCardModal = (props: IHandlerProps) => {
  const {
    // setFormState,
    cardId,
    cardModalVisible,
    addItemToColumn,
    setState,
    columnIndex,
    projectStartTime,
  } = props;

  const [formState, setFormState] = useSetState<BoardCard>();
  const [endDate, setEndDate] = useSetState({ endDate: new Date() });
  const [startDate, setStartDate] = useSetState({ startDate: new Date() });
  const { addToast } = useToasts();
  function formatDate(date: Date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    // return setStartDate({ startDate: [year, month, day].join("-") });
  }
  // if (startDate && endDate) {
  //   console.log(startDate);
  //   console.log(endDate);
  //   console.log(startDate.startDate < endDate.endDate);
  // }

  return (
    <>
      <Modal autoFocus={false} show={cardModalVisible}>
        <Modal.Header>
          <Modal.Title>Add Card</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            onSubmit={(e) => {
              // API Create Call - remove prevent default when api call in place
              e.preventDefault();

              setFormState((prev) => {
                const newState = prev;
                newState.taskId = cardId;
                return newState;
              });

              addItemToColumn(columnIndex, formState);

              // Run add Item function
              // setColumnState(0);
              // Set modalVisible to false
              setState({ cardModalVisible: false });
            }}
          >
            <Form.Group controlId={`${cardId}`}>
              <Form.Control type="string" value={cardId} disabled={true} />
            </Form.Group>
            <Form.Label>Task Name</Form.Label>
            <Form.Group controlId={`formBasicName ${cardId}`}>
              <Form.Control
                required={true}
                type="name"
                placeholder="Card Name"
                onChange={(i) => {
                  // Clone state to modify
                  const newState = formState;
                  // Set stateClone.tite to target value
                  newState.taskName = i.target.value;
                  setFormState(newState);
                }}
              />
            </Form.Group>
            <Form.Label>Task Comments</Form.Label>
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
            <Form.Label>Task Start Date</Form.Label>
            <Form.Group controlId={`formBasicstartDate ${cardId}`}>
              <Form.Control
                type="date"
                name="start date"
                // isValid={startDate.startDate < endDate.endDate}
                isInvalid={startDate.startDate > endDate.endDate}
                onChange={(i) => {
                  setFormState((prev) => {
                    const newState = prev;
                    newState.startTime = new Date(Date.parse(i.target.value));
                    return newState;
                  });
                  setStartDate({
                    startDate: new Date(Date.parse(i.target.value)),
                  });
                }}
              />
            </Form.Group>
            <Form.Label>Task End Date</Form.Label>
            <Form.Group controlId={`formBasicEndDate ${cardId}`}>
              <Form.Control
                type="date"
                name="End Date"
                placeholder="End Date"
                onChange={(i) => {
                  setFormState((prev) => {
                    const newState = prev;
                    newState.expectedEndTime = new Date(
                      Date.parse(i.target.value)
                    );
                    return newState;
                  });
                  setEndDate({ endDate: new Date(Date.parse(i.target.value)) });
                }}
              />
            </Form.Group>
            <Form.Label>Task Points</Form.Label>
            <Form.Group controlId={`formBasicPoints ${cardId}`}>
              <Form.Control
                type="number"
                name="Task Points"
                placeholder="Task Points"
                onChange={(i) => {
                  const newState = formState;
                  // const newState = formState
                  if (
                    newState.startTime &&
                    newState.startTime > projectStartTime
                  ) {
                    newState.points = 0;
                    newState.addedPoints = Number(i.target.value);
                  } else {
                    newState.points = Number(i.target.value);
                  }

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
            type="button"
            variant="secondary"
            onClick={() => {
              setState({ cardModalVisible: false });
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
