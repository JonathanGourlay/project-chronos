import React from "react";
import { Button, Navbar, NavDropdown } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Column from "./Column";
import ProjectsPage from './ProjectsPage'



const Navigation = () => {

    return (
        <Router>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>
                    Project Chronos
        </Navbar.Brand>
                {/* <ProjectsPage /> */}
                <Link
                    // variant="dark"
                    to="/projects"
                    style={
                        { marginLeft: 20, marginRight: 20 }
                    }>
                    Projects
                </Link>
                <Link
                    // variant="dark"
                    to="/dashboard"
                    style={
                        { marginLeft: 20, marginRight: 20 }
                    }>
                    Dashboard
            </Link>
                <Link
                    // variant="dark"
                    to="/week"
                    style={
                        { marginLeft: 20, marginRight: 20 }
                    }>
                    Week View
            </Link>
                <Link
                    // variant="dark"
                    to="/day"
                    style={
                        { marginLeft: 20, marginRight: 20 }
                    }>
                    Day View
            </Link>

            </Navbar>
            <Switch>
                <Route path="/projects">
                    <ProjectsPage />
                </Route>
                <Route path="/dashboard">
                    //dashboard
                </Route>
                <Route path="/week">
                    //Week Page Comp
          </Route>
                <Route path="/day">
                    //Day Page Comp
          </Route>
            </Switch>
        </Router>
    )

}
export default Navigation