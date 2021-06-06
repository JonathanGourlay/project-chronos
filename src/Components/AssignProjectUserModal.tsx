import { List } from "lodash";
import React, { Props } from "react";
import { Button, Modal, Form, Toast, Dropdown } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
// import { State } from "../Scripts/GlobalState";
// import { State } from "../Scripts/GlobalState";
import { createReducerContext, useSetState } from "react-use";
import apiClient from "../API/client";
import { CreateTask, ProjectDto, TaskDto, UserDto } from "../API/client/client";
import { stateObject } from "./KanBanBoardAdmin";

// Modal Props
interface IHandlerProps {
  project: ProjectDto;
  modalVisible: boolean | undefined;
  setState: (
    patch:
      | Partial<stateObject>
      | ((prevState: stateObject) => Partial<stateObject>)
  ) => void;
  users: Array<UserDto>;
}
interface FormProps {
  selectedUser: UserDto;
}

// Add Card Modal  Component
const AssignProjectUserModal = (props: IHandlerProps) => {
  const {
    // setFormState,
    project,
    modalVisible,
    users,
    setState,
  } = props;

  const [formState, setFormState] = useSetState<FormProps>();
  const { addToast } = useToasts();

  return (
    <>
      <Modal
        autoFocus={false}
        show={modalVisible}
        onShow={() => {
          console.log("load");
          // Get Users
          console.log(users);
        }}
      >
        <Modal.Header>
          <Modal.Title>Assign User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            onSubmit={async (e) => {
              // API Create Call - remove prevent default when api call in place
              e.preventDefault();
              await apiClient.setProjectUser(
                project.projectId,
                formState.selectedUser.userId
              );
            }}
          >
            <Form.Group controlId={`${project.projectId}`}>
              <Form.Control
                type="string"
                value={project.projectId}
                disabled={true}
              />
            </Form.Group>
            <Form.Label>Assign User</Form.Label>
            <Form.Group controlId={`formBasicName ${project.projectId}`}>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Users
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {users
                    ? users.map((user) => (
                        <>
                          <Dropdown.Item
                            onSelect={async () => {
                              setFormState((prev) => {
                                const newState = prev;
                                newState.selectedUser = user;
                                return newState;
                              });
                              await apiClient.setProjectUser(
                                project.projectId,
                                user.userId
                              );
                              setState((prev) => {
                                const newState = prev;
                                newState.assignModalVisible = false;
                                return newState;
                              });
                            }}
                          >
                            {user.userName} - {user.role}
                          </Dropdown.Item>
                          <Dropdown.Divider />
                        </>
                      ))
                    : undefined}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setState((prev) => {
                const newState = prev;
                newState.assignProjectModalVisible = false;
                return newState;
              });
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AssignProjectUserModal;
