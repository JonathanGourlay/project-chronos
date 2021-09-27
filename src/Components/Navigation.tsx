import React from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { UserDto } from "../API/client/client";
import GlobalContainer from "../API/GlobalState";
import DashboardPage from "../Pages/DashboardPage";
import ProjectsPage from "../Pages/ProjectsPage";
import WeekPage from "../Pages/WeekPage";
import { AccountModal } from "./AccountModal";

const Navigation = () => {
  const [accountModalVisible, setAccountModalVisible] = React.useState(false);
  const { activeUser, setActiveUser } = GlobalContainer.useContainer();
  React.useEffect(() => {
    if (activeUser === undefined) {
      setAccountModalVisible(true);
    }
  }, []);
  return (
    <div
      style={{
        backgroundColor: "#343a40f0",
        flex: 1,
        height: window.outerHeight * 5,
      }}
    >
      <Router>
        <Navbar
          bg="dark"
          variant="dark"
          style={{
            textAlign: "right",
            justifyContent: "space-between",
            position: "fixed",
            width: window.innerWidth - 10,
            zIndex: 2,
          }}
        >
          <Navbar.Brand>
            <h3>Project Chronos</h3>
          </Navbar.Brand>
          {/* <ProjectsPage /> */}
          {activeUser ? (
            <>
              <Link to="/projects" style={{ marginLeft: 20, marginRight: 20 }}>
                <h5>Projects</h5>
              </Link>
              <Link
                to="/projectInformation"
                style={{ marginLeft: 20, marginRight: 20 }}
              >
                <h5>Project Information</h5>
              </Link>
              <Link to="/week" style={{ marginLeft: 20, marginRight: 20 }}>
                <h5> Week View</h5>
              </Link>

              <Button
                variant="success"
                onClick={() => {
                  setActiveUser(undefined);
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="success"
              onClick={() => {
                setAccountModalVisible(true);
              }}
            >
              Login / Sign Up
            </Button>
          )}
        </Navbar>
        {activeUser ? (
          <Container fluid>
            <Switch>
              <Route path="/projects">
                <ProjectsPage />
              </Route>
              <Route path="/projectInformation">
                <DashboardPage />
              </Route>
              <Route path="/week">
                <WeekPage />
              </Route>
              <Route path="">
                <DashboardPage />
              </Route>
            </Switch>
          </Container>
        ) : null}
      </Router>
      <AccountModal
        accountModalVisible={accountModalVisible}
        setAccountModalVisible={setAccountModalVisible}
      />
    </div>
  );
};
export default Navigation;
