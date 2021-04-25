import React from "react";
import { Button, Navbar } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import GlobalContainer from "../API/GlobalState";
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
              <Link to="/day" style={{ marginLeft: 20, marginRight: 20 }}>
                Day View
              </Link>
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
          <Switch>
            <Route path="/projects">
              <ProjectsPage />
            </Route>
            <Route path="/dashboard">dashboard</Route>
            <Route path="/week">
              <WeekPage />
            </Route>

            <Route path="/day">Day Page Comp</Route>
          </Switch>
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
