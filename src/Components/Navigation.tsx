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
  return (
    <div>
      <Router>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>Project Chronos</Navbar.Brand>
          {/* <ProjectsPage /> */}
          {activeUser ? (
            <>
              <Link to="/projects" style={{ marginLeft: 20, marginRight: 20 }}>
                Projects
              </Link>
              <Link to="/dashboard" style={{ marginLeft: 20, marginRight: 20 }}>
                Dashboard
              </Link>
              <Link to="/week" style={{ marginLeft: 20, marginRight: 20 }}>
                Week View
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
              <Route path="/dashboard">
                <DashboardPage />
              </Route>
              <Route path="/week">
                <WeekPage />
              </Route>

              <Route path="/day">Day Page Comp</Route>
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
