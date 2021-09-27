import { forEach } from "lodash";
import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import {
  Button,
  Card,
  Row,
  Container,
  Col,
  Accordion,
  ButtonGroup,
  OverlayTrigger,
  Popover,
  ToggleButton,
} from "react-bootstrap";
import apiClient from "../API/client/";
import {
  CreateTimeLog,
  ICreateTimeLog,
  TaskDto,
  TaskObject,
  UpdateTask,
} from "../API/client/client";
import dayjs from "dayjs";
import * as isBetween from "dayjs/plugin/isBetween";

import GlobalContainer from "../API/GlobalState";
import Timer from "react-compound-timer/build";
import {
  BsFillPauseFill,
  BsPlay,
  BsStop,
  BsArrowCounterclockwise,
  BsPencil,
  BsCheckBox,
  BsTrash,
  BsPersonPlus,
} from "react-icons/bs";
import { useSetState } from "react-use";
export interface stateObject {
  tasks: TaskObject[];
  cardId: string;
  trelloCardId: string;
  card: TaskDto;
  counter: number;
  billable: string;
  startTime: Date;
  timerStatus: boolean;
}
export default function WeekPage() {
  const dow = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [state, setState] = useSetState<stateObject>();
  const { activeUser, setActiveUser } = GlobalContainer.useContainer();
  const getTasks = async () => {
    if (activeUser?.userId) {
      const tasksearch = await apiClient.getUserTasks(activeUser?.userId);
      console.log(tasksearch);
      setState({ tasks: tasksearch, timerStatus: false });
    }

    // console.log(tasksearch);
  };
  React.useEffect(() => {
    getTasks();
  }, []);

  return (
    <Container fluid={true}>
      <Button
        onClick={() => {
          getTasks();
        }}
      ></Button>
      <Row style={{ marginTop: 50 }}>
        {dow.map((day, index) => {
          return (
            <Col>
              <Card>
                <Card.Header>
                  <Card.Title>{day}</Card.Title>
                </Card.Header>
                <Card.Body className="text-center p-0">
                  <div>
                    {state.tasks && state.tasks.length > 0 ? (
                      state.tasks.map((task) => {
                        if (
                          task.endTime &&
                          task.endTime <
                            new Date(
                              new Date().setDate(new Date().getDate() + 7)
                            ) &&
                          days[
                            task.endTime!.getDay() != 6 &&
                            task.endTime!.getDay() != 0
                              ? task.endTime!.getDay()
                              : 1
                          ] === day
                        ) {
                          return (
                            <div className="border border-info rounded p-2">
                              <Card
                                key={task.taskId}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                  background:
                                    task.points === 0
                                      ? "#40464bb5"
                                      : "lightgrey",
                                  border: "none",
                                  color: "black",
                                }}
                              >
                                <Card.Header
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Timer
                                    initialTime={1}
                                    startImmediately={false}
                                  >
                                    {({
                                      start,
                                      resume,
                                      pause,
                                      stop,
                                      reset,
                                      timerState,
                                    }) => (
                                      <React.Fragment>
                                        <div>
                                          <Timer.Days /> : <Timer.Hours /> :{" "}
                                          <Timer.Minutes /> : <Timer.Seconds />{" "}
                                        </div>

                                        <br />
                                        <div>
                                          {state.timerStatus ? (
                                            <Button
                                              style={{
                                                backgroundColor: "transparent",
                                              }}
                                              hidden={
                                                task.points === 0 ||
                                                task.taskDone === "true"
                                              }
                                              onClick={() => {
                                                pause();
                                                setState({
                                                  timerStatus: false,
                                                });
                                              }}
                                            >
                                              <BsFillPauseFill />
                                            </Button>
                                          ) : (
                                            <Button
                                              hidden={
                                                task.points === 0 ||
                                                task.taskDone === "true"
                                              }
                                              onClick={() => {
                                                start();
                                                setState({
                                                  startTime: new Date(),
                                                  timerStatus: true,
                                                });
                                              }}
                                              style={{
                                                backgroundColor: "transparent",
                                                border: "none",
                                              }}
                                            >
                                              <BsPlay />
                                            </Button>
                                          )}
                                          <OverlayTrigger
                                            trigger="click"
                                            placement="right"
                                            overlay={
                                              <Popover
                                                id="popover-basic"
                                                style={{
                                                  width: 200,
                                                  justifySelf: "space-between",
                                                }}
                                              >
                                                <Popover.Title as="h3">
                                                  Billable Hours?
                                                </Popover.Title>
                                                <Popover.Content
                                                  style={{
                                                    textAlign: "center",
                                                  }}
                                                >
                                                  <div>
                                                    <ButtonGroup toggle>
                                                      <ToggleButton
                                                        key={"true"}
                                                        type="radio"
                                                        variant="success"
                                                        name="radio"
                                                        value={"true"}
                                                        checked={
                                                          state.billable ===
                                                          "true"
                                                        }
                                                        onChange={() => {
                                                          setState({
                                                            billable: "true",
                                                          });
                                                        }}
                                                      >
                                                        True
                                                      </ToggleButton>
                                                      <ToggleButton
                                                        key={"false"}
                                                        type="radio"
                                                        variant="danger"
                                                        name="radio"
                                                        value={"false"}
                                                        checked={
                                                          state.billable ===
                                                          "false"
                                                        }
                                                        onChange={() => {
                                                          setState({
                                                            billable: "false",
                                                          });
                                                        }}
                                                      >
                                                        False
                                                      </ToggleButton>
                                                    </ButtonGroup>
                                                  </div>
                                                  <div>
                                                    <Button
                                                      style={{
                                                        marginTop: 10,
                                                      }}
                                                      onClick={async () => {
                                                        stop();
                                                        // Create Timelog Modal

                                                        let newTimeLog: ICreateTimeLog =
                                                          {
                                                            billable:
                                                              state.billable,
                                                            startTime:
                                                              state.startTime,
                                                            endTime: new Date(),
                                                            userId:
                                                              activeUser?.userId,
                                                            taskId: task.taskId,
                                                            archived: "false",
                                                          };

                                                        console.log(newTimeLog);
                                                        await apiClient.createTimeLog(
                                                          new CreateTimeLog(
                                                            newTimeLog
                                                          )
                                                        );
                                                      }}
                                                    >
                                                      Submit
                                                    </Button>
                                                  </div>
                                                </Popover.Content>
                                              </Popover>
                                            }
                                          >
                                            <Button
                                              hidden={
                                                task.points === 0 ||
                                                task.taskDone === "true"
                                              }
                                              onClick={async () => {}}
                                              style={{
                                                backgroundColor: "transparent",
                                                border: "none",
                                              }}
                                            >
                                              <BsStop />
                                            </Button>
                                          </OverlayTrigger>
                                          <Button
                                            style={{
                                              backgroundColor: "transparent",
                                              border: "none",
                                            }}
                                            hidden={
                                              task.points === 0 ||
                                              task.taskDone === "true"
                                            }
                                            onClick={reset}
                                          >
                                            <BsArrowCounterclockwise />
                                          </Button>
                                        </div>
                                      </React.Fragment>
                                    )}
                                  </Timer>
                                </Card.Header>

                                <Card.Body className="text-center p-0">
                                  <Button
                                    style={{
                                      backgroundColor: "transparent",
                                      borderColor: "green",
                                    }}
                                    hidden={task.taskDone === "true"}
                                    onClick={() => {
                                      task.taskDone = "true";
                                      const request = new UpdateTask(task);
                                      request.taskDone = "true";
                                      request.pointsTotal = task.points;
                                      request.addedPoints = task.addedPoints;
                                      apiClient.updateTask(request);
                                    }}
                                    variant="success"
                                  >
                                    <BsCheckBox />
                                  </Button>

                                  <Card.Title>{task.points} Points</Card.Title>

                                  <Card.Title>{task.taskName}</Card.Title>
                                  <Card.Text
                                    style={{
                                      maxHeight: 100,
                                      padding: 10,
                                      overflow: "auto",
                                    }}
                                  >
                                    {task.comments}
                                  </Card.Text>
                                </Card.Body>
                                <Card.Footer
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                ></Card.Footer>
                              </Card>
                            </div>
                          );
                        }
                      })
                    ) : (
                      <Card.Title>NO-DATA</Card.Title>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
