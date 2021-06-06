import { List } from "lodash";
import React, { Props } from "react";
import { Button, Modal, Form, Toast, Dropdown } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
// import { State } from "../Scripts/GlobalState";
// import { State } from "../Scripts/GlobalState";
import { createReducerContext, useSetState } from "react-use";
import apiClient from "../API/client";
import { CreateTask, TaskDto, UserDto } from "../API/client/client";
import { stateObject } from "./KanBanBoardAdmin";

// Modal Props
interface IHandlerProps {
  card: TaskDto;
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
const AssignUserModal = (props: IHandlerProps) => {
  const {
    // setFormState,
    card,
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
              apiClient.setTaskUser(card.taskId, formState.selectedUser.userId);
            }}
          >
            <Form.Group controlId={`${card.taskId}`}>
              <Form.Control type="string" value={card.taskId} disabled={true} />
            </Form.Group>
            <Form.Label>Assign User</Form.Label>
            <Form.Group controlId={`formBasicName ${card.taskId}`}>
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
                              await apiClient.setTaskUser(
                                card.taskId,
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
                newState.assignModalVisible = false;
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
export default AssignUserModal;
