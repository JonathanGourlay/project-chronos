import React from "react";
import { Button, Modal, Form, Toast } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
// import { State } from "../Scripts/GlobalState";
// import { State } from "../Scripts/GlobalState";
import { createReducerContext, useSetState } from "react-use";
import apiClient from "../API/client";
import { CreateColumn, CreateProject, ProjectDto } from "../API/client/client";
import { stateObject } from "./KanBanBoardAdmin";

// Modal Props
interface IHandlerProps {
  projectModalVisible: boolean;
  project: ProjectDto;
  setState: (
    patch:
      | Partial<stateObject>
      | ((prevState: stateObject) => Partial<stateObject>)
  ) => void;
}

// Add Card Modal  Component
const AddProjectModal = (props: IHandlerProps) => {
  const {
    // setFormState,
    projectModalVisible,
    project,
    setState,
  } = props;

  const [formState, setFormState] = useSetState<ProjectDto>();
  const { addToast } = useToasts();

  return (
    <>
      <Modal autoFocus={false} show={projectModalVisible}>
        <Modal.Header>
          <Modal.Title>Add Project</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            onSubmit={async (e) => {
              // API Create Call - remove prevent default when api call in place
              // setFormState((prev) => {
              //   const newState = prev;
              //   newState.projectStartTime = project.projectStartTime;
              //   newState.projectArchived = "false";
              //   newState.projectComplete = "false";
              // return newState;
              // });
              e.preventDefault();

              const createRequest = new CreateProject();
              createRequest.projectName = formState.projectName;
              createRequest.timeIncrement =
                formState.timeIncrement !== 0 ? formState.timeIncrement : 15;
              createRequest.projectStartTime = formState.projectStartTime;
              createRequest.projectEndTime = formState.projectEndTime;
              createRequest.expectedEndTime = formState.expectedEndTime;
              createRequest.projectArchived = "false";
              createRequest.projectComplete = "false";
              console.log(createRequest);
              const result = await apiClient.createProject(createRequest);
              setState((prev) => {
                const newState = prev;
                newState.selectedBoard.projectId = result;
                newState.selectedBoard.projectName = formState.projectName;
                newState.selectedBoard.timeIncrement =
                  formState.timeIncrement !== 0 ? formState.timeIncrement : 15;
                newState.selectedBoard.projectStartTime =
                  formState.projectStartTime;
                newState.selectedBoard.projectEndTime =
                  formState.projectEndTime;
                newState.selectedBoard.expectedEndTime =
                  formState.expectedEndTime;
                ////////
                newState.selectedBoard.columns?.map(async (col, index) => {
                  const createCol = new CreateColumn();
                  createCol.columnName = col.columnName;
                  createCol.projectId = result;
                  createCol.pointsTotal = 0;
                  createCol.pointsTotal = 0;
                  const colId = await apiClient.createColumn(createCol);
                  if (newState.selectedBoard.columns) {
                    newState.selectedBoard.columns[index].columnId = colId;
                  }
                });
                return newState;
              });
            }}
          >
            <Form.Group controlId={`${project.trelloProjectId}`}>
              <Form.Control
                type="string"
                value={project.projectId}
                disabled={true}
              />
            </Form.Group>
            <Form.Label>Project Name</Form.Label>
            <Form.Group controlId={`formBasicName ${project.projectId}`}>
              <Form.Control
                required={true}
                type="name"
                defaultValue={
                  project.projectName ? project.projectName : "Project Name"
                }
                onChange={(i) => {
                  // Clone state to modify
                  const newState = formState;
                  // Set stateClone.tite to target value
                  newState.projectName = i.target.value;
                  setFormState(newState);
                }}
              />
            </Form.Group>
            <Form.Label>Project Time Increment</Form.Label>
            <Form.Group
              controlId={`formBasicTimeIncrement ${project.trelloProjectId}`}
            >
              <Form.Control
                required={true}
                type="number"
                step={5}
                defaultValue={
                  project.timeIncrement !== 0 ? project.timeIncrement : 15
                }
                onChange={(i) => {
                  const newState = formState;
                  // const newState = formState
                  newState.timeIncrement = Number(i.target.value);
                  setFormState(newState);
                }}
              />
            </Form.Group>
            <Form.Control
              type="string"
              value={`Current Start Date - ${project.projectStartTime?.toLocaleDateString()}`}
              disabled={true}
            />
            <Form.Group
              controlId={`formBasicstartDate ${project.trelloProjectId}`}
            >
              <Form.Control
                type="date"
                name="start date"
                // isValid={startDate.startDate < endDate.endDate}
                onChange={(i) => {
                  setFormState((prev) => {
                    const newState = prev;
                    newState.projectStartTime = new Date(
                      Date.parse(i.target.value)
                    );
                    return newState;
                  });
                }}
              />
            </Form.Group>
            <Form.Label>Project End Date</Form.Label>
            <Form.Group controlId={`formBasicEndDate ${project.projectId}`}>
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
                    newState.projectEndTime = new Date(
                      Date.parse(i.target.value)
                    );
                    return newState;
                  });
                  // setFormState((prev) => {
                  //   const newState = prev;
                  //   newState.projectEndTime = new Date(
                  //     Date.parse(i.target.value)
                  //   );
                  //   console.log(formState.projectEndTime);
                  //   return newState;
                  // });
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
              setState({ projectModalVisible: false });
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AddProjectModal;
