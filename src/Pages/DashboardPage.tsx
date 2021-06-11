import { forEach } from "lodash";
import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Card, Row, Container, Col, Dropdown } from "react-bootstrap";
import apiClient from "../API/client";
import { ProjectDto, TaskObject } from "../API/client/client";
import dayjs from "dayjs";
import * as isBetween from "dayjs/plugin/isBetween";

import GlobalContainer from "../API/GlobalState";
import { useSetState } from "react-use";

export interface stateObject {
  pointsTotal: number;
  addedPointsTotal: number;
  pointsAchieved: number;
  projects: ProjectDto[];
  selectedBoard: ProjectDto;
  prevPointsTotal: number;
  prevAddedPoints: number;
  prevPointsAchieved: number;
  thisPointsTotal: number;
  thisAddedPoints: number;
  thisPointsAchieved: number;
}

export default function DashboardPage() {
  const tasks: TaskObject[] = [];
  const [state, setState] = useSetState<stateObject>();
  const { activeUser, setActiveUser } = GlobalContainer.useContainer();

  const getDbBoards = async (userId: number) => {
    const boards = await apiClient.getUserProjects(userId);
    var pointsTotal = 0;
    var addedPoints = 0;
    var pointsAchieved = 0;
    var prevPointsTotal = 0;
    var prevAddedPoints = 0;
    var prevPointsAchieved = 0;
    var thisPointsTotal = 0;
    var thisAddedPoints = 0;
    var thisPointsAchieved = 0;
    boards.map((board) => {
      if (
        board.expectedEndTime &&
        board.expectedEndTime >= new Date() &&
        board.pointsTotal &&
        board.addedPoints &&
        board.pointsAchived
      ) {
        thisPointsTotal = thisPointsTotal + board.pointsTotal;
        thisAddedPoints = thisAddedPoints + board.addedPoints;
        thisPointsAchieved = thisPointsAchieved + board.pointsAchived;
      }
      if (
        board.expectedEndTime &&
        board.expectedEndTime >
          new Date(new Date().setMonth(new Date().getMonth() - 1)) &&
        board.expectedEndTime < new Date() &&
        board.pointsTotal &&
        board.addedPoints &&
        board.pointsAchived
      ) {
        prevPointsTotal = prevPointsTotal + board.pointsTotal;
        prevAddedPoints = prevAddedPoints + board.addedPoints;
        prevPointsAchieved = prevPointsAchieved + board.pointsAchived;
      }

      if (board.pointsTotal && board.addedPoints && board.pointsAchived) {
        pointsTotal = pointsTotal + board.pointsTotal;
        addedPoints = addedPoints + board.addedPoints;
        pointsAchieved = pointsAchieved + board.pointsAchived;
      }
    });
    setState({
      ...state,
      projects: boards,
      pointsTotal: pointsTotal,
      pointsAchieved: pointsAchieved,
      addedPointsTotal: addedPoints,
      prevPointsTotal: prevPointsTotal,
      prevAddedPoints: prevAddedPoints,
      prevPointsAchieved: prevPointsAchieved,
      thisPointsTotal: thisPointsTotal,
      thisAddedPoints: thisAddedPoints,
      thisPointsAchieved: thisPointsAchieved,
    });
  };
  React.useEffect(() => {}, [state?.selectedBoard]);
  React.useEffect(() => {
    if (activeUser?.userId) {
      getDbBoards(activeUser.userId);
    }
  }, []);

  return (
    <div>
      {state?.projects ? (
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {state.selectedBoard
              ? state.selectedBoard.projectName
              : "Select Project"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {state.projects.map((project) => (
              <>
                <Dropdown.Item
                  onSelect={() => {
                    setState({ selectedBoard: project });
                  }}
                >
                  {project.projectName}
                </Dropdown.Item>
                <Dropdown.Divider />
              </>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button
          type="button"
          variant="info"
          className="m-1"
          onClick={() => {
            //NOTE - change this to the logged in users key
            activeUser && activeUser !== undefined
              ? getDbBoards(activeUser.userId)
              : console.log("missed");
          }}
        >
          Get Boards
        </Button>
      )}

      <h1>
        {state.prevPointsAchieved?.toFixed(0)} Points Achieved Last Month Out of{" "}
        {state.prevPointsTotal?.toFixed(0)} <br />
        <Button
          style={{
            backgroundColor:
              state.prevPointsAchieved > state.thisPointsAchieved
                ? "red"
                : "green",
          }}
        />
        {state.thisPointsAchieved?.toFixed(0)} Points Achieved This Month Out of{" "}
        {state.thisPointsTotal?.toFixed(0)}{" "}
        <Button
          style={{
            backgroundColor:
              state.prevPointsTotal > state.thisPointsTotal ? "red" : "green",
          }}
        />{" "}
        <br />
        {state.prevAddedPoints?.toFixed(0)} Points Added After Project Start
        Last Month <br />
        <Button
          style={{
            backgroundColor:
              state.prevAddedPoints < state.thisAddedPoints ? "red" : "green",
          }}
        />
        {state.thisAddedPoints?.toFixed(0)} Points Added After Project Start
        This Month <br />
      </h1>
    </div>
  );
}
