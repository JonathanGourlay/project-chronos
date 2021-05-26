import React from "react";
import {
  Modal,
  Form,
  Button,
  Tabs,
  Tab,
  Popover,
  OverlayTrigger,
  Overlay,
  Toast,
  Dropdown,
} from "react-bootstrap";
import apiClient from "../API/client/";
import { LoginObject, UserDto } from "../API/client/client";
import { useToasts } from "react-toast-notifications";
import GlobalContainer from "../API/GlobalState";

interface iLoginDetails {
  email?: string;
  userName?: string;
  role?: string;
  password?: string;
  accessToken?: string;
}
interface IHandlerProps {
  accountModalVisible: boolean | undefined;
  setAccountModalVisible: (show: boolean) => void;
}
const popover = (
  <Popover
    style={{
      display: "grid",
    }}
    id="AccessTokenPopover"
  >
    <Popover.Title as="h3">Personal Access Token</Popover.Title>
    <Popover.Content>
      Please enter your personal access token for your chosen Project Management
      Tool. <br /> The following button will take you to GitHub's documentation
      for this:
    </Popover.Content>
    <Button
      variant="primary"
      type="submit"
      onClick={() => {
        window.open(
          "https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token"
        );
      }}
    >
      Documentation
    </Button>
  </Popover>
);

export const AccountModal = (props: IHandlerProps) => {
  const [loginDetails, setLoginDetails] = React.useState<iLoginDetails>();
  const { addToast } = useToasts();
  const { activeUser, setActiveUser } = GlobalContainer.useContainer();
  const successfulLogin = (user: UserDto) => {
    props.setAccountModalVisible(false);
    //set global state to contain user info
    setActiveUser(user);
  };
  const errorToast = (
    <Toast>
      <Toast.Body>
        Username or password incorrect <br /> Please try again
      </Toast.Body>
    </Toast>
  );
  return (
    <div>
      <Modal show={props.accountModalVisible}>
        <Modal.Header>
          <Modal.Title>Account</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Tabs defaultActiveKey="account">
            <Tab eventKey="Login" title="Login">
              <Form>
                <Form.Group controlId={`formEmail`}>
                  <Form.Control
                    required={true}
                    type="email"
                    placeholder="Email Address"
                    onChange={(i) => {
                      setLoginDetails({
                        ...loginDetails,
                        email: i.target.value,
                      });
                    }}
                  />
                </Form.Group>
                <Form.Group controlId={`formPassword`}>
                  <Form.Control
                    required={true}
                    type="password"
                    placeholder="Password"
                    onChange={(i) => {
                      // Clone state to modify
                      setLoginDetails({
                        ...loginDetails,
                        password: i.target.value,
                      });
                    }}
                  />
                </Form.Group>
              </Form>
              <Button
                variant="primary"
                type="submit"
                onClick={async (e) => {
                  //check password and email are correct to login if they are successfully login
                  const postObj = new LoginObject();
                  postObj.email = loginDetails?.email;
                  postObj.password = loginDetails?.password;
                  const result = await apiClient.checkLogin(postObj);
                  result && successfulLogin(result);
                  if (!result) {
                    props.setAccountModalVisible(false);
                    addToast(errorToast, {
                      appearance: "error",
                      autoDismiss: true,
                    });
                  }
                }}
              >
                Login
              </Button>
            </Tab>
            <Tab eventKey="Create" title="Create">
              <Form>
                <Form.Group controlId={`formUserName`}>
                  <Form.Control
                    required={true}
                    type="name"
                    placeholder="User Name"
                    onChange={(i) => {
                      setLoginDetails({
                        ...loginDetails,
                        userName: i.target.value,
                      });
                    }}
                  />
                </Form.Group>

                <Form.Group controlId={`formRole`}>
                  <Dropdown>
                    <Dropdown.Toggle style={{ width: 466 }}>
                      {loginDetails?.role ? loginDetails.role : ""}
                    </Dropdown.Toggle>
                    <Dropdown.Menu align={"right"}>
                      <Dropdown.Item
                        onSelect={() => {
                          setLoginDetails({
                            ...loginDetails,
                            role: "Admin",
                          });
                        }}
                      >
                        Admin
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        onSelect={() => {
                          setLoginDetails({
                            ...loginDetails,
                            role: "Developer",
                          });
                        }}
                      >
                        Developer
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
                <Form.Group controlId={`formEmail`}>
                  <Form.Control
                    required={true}
                    type="email"
                    placeholder="Email Address"
                    onChange={(i) => {
                      setLoginDetails({
                        ...loginDetails,
                        email: i.target.value,
                      });
                    }}
                  />
                </Form.Group>
                <Form.Group controlId={`formPassword`}>
                  <Form.Control
                    required={true}
                    type="password"
                    placeholder="Password"
                    onChange={(i) => {
                      // Clone state to modify
                      setLoginDetails({
                        ...loginDetails,
                        password: i.target.value,
                      });
                    }}
                  />
                </Form.Group>
                <Form.Group controlId={`formGitKey`}>
                  <div>
                    <OverlayTrigger
                      trigger="focus"
                      placement="right"
                      overlay={popover}
                    >
                      <Form.Control
                        required={true}
                        type="name"
                        placeholder="Access Token"
                        onChange={(i) => {
                          // Clone state to modify
                          setLoginDetails({
                            ...loginDetails,
                            accessToken: i.target.value,
                          });
                        }}
                      />
                    </OverlayTrigger>
                  </div>
                </Form.Group>
              </Form>
              <Button
                variant="primary"
                type="submit"
                onClick={async (e) => {
                  const postObj = new UserDto();
                  postObj.email = loginDetails?.email;
                  postObj.password = loginDetails?.password;
                  postObj.archived = "false";
                  postObj.accessToken = loginDetails?.accessToken;
                  postObj.userName = loginDetails?.userName;
                  postObj.role = loginDetails?.role;
                  const result = await apiClient.createUser(postObj);

                  result != null
                    ? successfulLogin(result)
                    : addToast(errorToast, {
                        appearance: "error",
                        autoDismiss: true,
                      });
                }}
              >
                Sign Up
              </Button>
            </Tab>
          </Tabs>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              props.setAccountModalVisible(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
