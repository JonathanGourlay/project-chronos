import { forEach } from "lodash";
import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Card, Row, Container, Col } from "react-bootstrap";
import apiClient from "../API/client/";
import { TaskObject } from "../API/client/client";
import dayjs from "dayjs";
import * as isBetween from "dayjs/plugin/isBetween";

import GlobalContainer from "../API/GlobalState";

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
  const tasks: TaskObject[] = [];
  const [state, setState] = React.useState({ tasks: tasks });
  const { activeUser, setActiveUser } = GlobalContainer.useContainer();
  const getTasks = async () => {
    if (activeUser?.userId) {
      const tasksearch = await apiClient.getUserTasks(activeUser?.userId);
      console.log(tasksearch);
      setState({ tasks: tasksearch });
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
                    {state.tasks.length > 0 ? (
                      state.tasks.map((task) => {
                        if (
                          task.endTime &&
                          task.endTime > new Date() &&
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
                            <div>
                              <Card
                                key={task.taskId}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                  background:
                                    task.points !== 0 ? "green" : "red",
                                  border: "none",
                                }}
                              >
                                <Card.Body className="text-center p-0">
                                  <Card.Title>{task.taskName}</Card.Title>
                                  <Card.Title>{task.comments}</Card.Title>
                                  <Card.Title>{task.points}</Card.Title>
                                </Card.Body>
                              </Card>
                              {task.timelogs?.map((timelog) => {
                                return (
                                  <Card.Text>{timelog.startTime}</Card.Text>
                                );
                              })}
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
