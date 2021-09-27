import { forEach } from "lodash";
import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import {
  Button,
  Card,
  Row as tr,
  Container,
  Col as td,
  Dropdown,
  ProgressBar,
  Table,
} from "react-bootstrap";
import apiClient from "../API/client";
import {
  ProjectDto,
  TaskObject,
  TimeLogDto,
  TimeLogViewDto,
} from "../API/client/client";
import dayjs from "dayjs";
import * as isBetween from "dayjs/plugin/isBetween";

import GlobalContainer from "../API/GlobalState";
import { useSetState } from "react-use";

export interface stateObject {
  pointsTotal: number;
  addedPointsTotal: number;
  pointsAchieved: number;
  projects: ProjectDto[];
  timelogs: TimeLogDto[];
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
  React.useEffect(() => {
    getDbBoards(activeUser!.userId);
  }, []);
  const getDbBoards = async (userId: number) => {
    const boards = await apiClient.getUserProjects(userId);
    const timelogs = await apiClient.getUserTimelogs(userId);
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
      timelogs: timelogs,
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
    console.log(state.prevPointsAchieved);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      <Table style={{ marginTop: 80 }}>
        <tr>
          <td>
            <Card>
              <h1>
                {state.prevPointsAchieved?.toFixed(0)} Points Achieved Last
                Month Out of {state.prevPointsTotal?.toFixed(0)}{" "}
                <Button
                  style={{
                    backgroundColor:
                      state.prevPointsAchieved > state.thisPointsAchieved
                        ? "red"
                        : "green",
                  }}
                />
              </h1>
              <h1>
                {state.thisPointsAchieved?.toFixed(0)} Points Achieved This
                Month Out of {state.thisPointsTotal?.toFixed(0)}{" "}
                <Button
                  style={{
                    backgroundColor:
                      state.prevPointsTotal > state.thisPointsTotal
                        ? "red"
                        : "green",
                  }}
                />{" "}
                <br />
              </h1>
            </Card>
          </td>

          <td>
            <Card>
              <h1>
                {state.prevAddedPoints?.toFixed(0)} Points Added After Project
                Start Last Month{" "}
                <Button
                  style={{
                    backgroundColor:
                      state.prevAddedPoints < state.thisAddedPoints
                        ? "red"
                        : "green",
                  }}
                />
              </h1>
              <h1>
                {state.thisAddedPoints?.toFixed(0)} Points Added After Project
                Start This Month <br />
              </h1>
            </Card>
          </td>
        </tr>
        <tr>
          {state.timelogs && (
            <>
              <td>
                <Card>
                  <h1>You have created {state.timelogs.length} timelogs</h1>
                </Card>
              </td>

              <td>
                <Card>
                  <h1>
                    {state.timelogs
                      .reduce((a, b) => a + (b.totalTime ? b.totalTime : 0), 0)
                      .toFixed(2)}{" "}
                    Hours Worked
                  </h1>
                </Card>
              </td>
            </>
          )}
        </tr>
        <tr>
          <td colSpan={2}>
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
          </td>
        </tr>
        <tr>
          {state.selectedBoard ? (
            <>
              {/* <Col> */}
              <td>
                <h1>
                  <Card>Points Achived Percentage</Card>
                  <Card>
                    <ProgressBar
                      animated
                      now={
                        state.selectedBoard.pointsAchived &&
                        state.selectedBoard.pointsTotal &&
                        (state.selectedBoard.pointsAchived /
                          state.selectedBoard.pointsTotal) *
                          100
                      }
                      label={`${
                        state.selectedBoard.pointsAchived &&
                        state.selectedBoard.pointsTotal &&
                        (
                          (state.selectedBoard.pointsAchived /
                            state.selectedBoard.pointsTotal) *
                          100
                        ).toPrecision(2)
                      } %`}
                    />
                  </Card>
                </h1>
              </td>
              <td>
                <h1>
                  <Card>
                    {state.selectedBoard.pointsAchived} Points Achived out of{" "}
                    {state.selectedBoard.pointsTotal}
                    <br />
                  </Card>

                  <Card>
                    {state.selectedBoard.addedPoints} Points added since project
                    kicked off
                    <br />
                  </Card>
                </h1>
              </td>
            </>
          ) : undefined}
        </tr>
      </Table>
    </div>
  );
}
