import React from "react";
import { Button, Modal, Form, Toast } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
// import { State } from "../Scripts/GlobalState";
// import { State } from "../Scripts/GlobalState";
import { createReducerContext, useSetState } from "react-use";
import apiClient from "../API/client";
import { CreateTask, TaskDto } from "../API/client/client";
import { BoardCard, stateObject } from "./KanBanBoard";

// Modal Props
interface IHandlerProps {
  card: TaskDto;
  cardModalVisible: boolean | undefined;
  setState: (
    patch:
      | Partial<stateObject>
      | ((prevState: stateObject) => Partial<stateObject>)
  ) => void;
  columnId: number;
}

// Add Card Modal  Component
const UpdateCardModal = (props: IHandlerProps) => {
  const {
    // setFormState,
    card,
    cardModalVisible,
    setState,
    columnId,
  } = props;

  const [formState, setFormState] = useSetState<BoardCard>();
  const [endDate, setEndDate] = useSetState({ endDate: new Date() });
  const [startDate, setStartDate] = useSetState({ startDate: new Date() });
  const { addToast } = useToasts();

  return (
    <>
      <Modal autoFocus={false} show={cardModalVisible}>
        <Modal.Header>
          <Modal.Title>Update Card</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            onFocus={() => {
              console.log("load");
              setFormState((prev) => {
                const newState = prev;
                newState.taskName = card.taskName;
                newState.taskArchived = "false";
                newState.taskDeleted = "false";
                newState.taskDone = "false";
                newState.startTime = card.startTime;
                newState.expectedEndTime = card.expectedEndTime;
                newState.endTime = card.expectedEndTime;
                return newState;
              });
            }}
            onSubmit={async (e) => {
              // API Create Call - remove prevent default when api call in place
              e.preventDefault();

              setFormState((prev) => {
                const newState = prev;
                newState.taskId = card.taskId;
                return newState;
              });
              const createtaskReq = new CreateTask();
              createtaskReq.columnId = columnId;
              createtaskReq.taskName = formState.taskName;
              createtaskReq.comments = formState.comments;
              createtaskReq.startTime = formState.startTime;
              createtaskReq.expectedEndTime = formState.expectedEndTime;
              createtaskReq.extensionReason = formState.extensionReason;
              createtaskReq.endTime = formState.endTime;
              createtaskReq.pointsTotal = formState.points;
              createtaskReq.addedPointsTotal = formState.addedPoints;
              createtaskReq.extensionReason = formState.extensionReason;
              createtaskReq.addedReason = formState.addedReason;
              createtaskReq.taskArchived = "false";
              createtaskReq.taskDeleted = "false";
              createtaskReq.taskDone = "false";
              console.log(createtaskReq);
              const result = await apiClient.createTask(createtaskReq);
              setState((prev) => {
                const newState = prev;
                newState.cardModalVisible = false;
                if (newState.selectedBoard.columns) {
                  const num = newState.selectedBoard.columns.findIndex(
                    (column) => column.columnId === columnId
                  );
                  newState.selectedBoard.columns[num].columnId = result;
                }
                return newState;
              });
              setState({ cardModalVisible: false });
            }}
          >
            <Form.Group controlId={`${card.taskId}`}>
              <Form.Control type="string" value={card.taskId} disabled={true} />
            </Form.Group>
            <Form.Label>Task Name</Form.Label>
            <Form.Group controlId={`formBasicName ${card.taskId}`}>
              <Form.Control
                required={true}
                type="name"
                defaultValue={card.taskName}
                onChange={(i) => {
                  // Clone state to modify
                  const newState = formState;
                  // Set stateClone.tite to target value
                  newState.taskName = i.target.value;
                  setFormState(newState);
                }}
              />
            </Form.Group>
            <Form.Label>Comments</Form.Label>
            <Form.Group controlId={`formBasicComments ${card.taskId}`}>
              <Form.Control
                required={true}
                type="comments"
                defaultValue={card.comments}
                onChange={(i) => {
                  const newState = formState;
                  // const newState = formState
                  newState.comments = i.target.value;
                  setFormState(newState);
                }}
              />
            </Form.Group>
            <Form.Control
              type="string"
              value={`Current Start Date - ${card.startTime?.toLocaleDateString()}`}
              disabled={true}
            />
            <Form.Group controlId={`formBasicstartDate ${card.taskId}`}>
              <Form.Control
                type="date"
                name="start date"
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
            <Form.Control
              type="string"
              value={`Current End Date - ${card.expectedEndTime?.toLocaleDateString()}`}
              disabled={true}
            />
            <Form.Group controlId={`formBasicEndDate ${card.taskId}`}>
              <Form.Control
                type="date"
                name="End Date"
                onChange={(i) => {
                  setFormState((prev) => {
                    const newState = prev;
                    newState.expectedEndTime = new Date(
                      Date.parse(i.target.value)
                    );
                    newState.endTime = new Date(Date.parse(i.target.value));
                    return newState;
                  });
                  setEndDate({ endDate: new Date(Date.parse(i.target.value)) });
                }}
              />
            </Form.Group>
            <Form.Label>Task Points</Form.Label>
            <Form.Group controlId={`formBasicPoints ${card.taskId}`}>
              <Form.Control
                type="number"
                name="Task Points"
                defaultValue={card.points}
                onChange={(i) => {
                  const newState = formState;

                  newState.points = Number(i.target.value);

                  setFormState(newState);
                }}
              />
            </Form.Group>
            <Form.Label>Task Added Points</Form.Label>
            <Form.Group controlId={`formBasicAddedePoints ${card.taskId}`}>
              <Form.Control
                type="number"
                name="Added Task Points"
                defaultValue={card.addedPoints}
                onChange={(i) => {
                  const newState = formState;

                  newState.addedPoints = Number(i.target.value);

                  setFormState(newState);
                }}
              />
            </Form.Group>
            <Form.Label>Added Reason</Form.Label>
            <Form.Group controlId={`formBasicAddedReason ${card.taskId}`}>
              <Form.Control
                required={true}
                type="reason"
                defaultValue={card.addedReason}
                onChange={(i) => {
                  const newState = formState;
                  // const newState = formState
                  newState.addedReason = i.target.value;
                  setFormState(newState);
                }}
              />
            </Form.Group>
            <Form.Label>Extention Reason</Form.Label>
            <Form.Group controlId={`formBasicExtReason ${card.taskId}`}>
              <Form.Control
                required={true}
                type="reason"
                defaultValue={card.extensionReason}
                onChange={(i) => {
                  const newState = formState;
                  // const newState = formState
                  newState.extensionReason = i.target.value;
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
              setState({ updateCardModalVisible: false });
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default UpdateCardModal;
