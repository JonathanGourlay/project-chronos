import { forEach } from "lodash";
import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Card, Row, Container, Col } from "react-bootstrap";
import apiClient from "../API/client/";
import { TaskObject } from "../API/client/client";

export default function WeekPage() {
  const dow = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const tasks: TaskObject[] = [];
  const [state, setState] = React.useState({ tasks: tasks });
  const getTasks = async () => {
    const tasksearch = await apiClient.getUserTasks(1);
    setState({ tasks: tasksearch });
    // console.log(tasksearch);
  };

  return (
    <Container fluid={true}>
      <Button
        onClick={() => {
          getTasks();
        }}
      ></Button>
      <Row>
        {dow.map((day, index) => {
          return (
            <Col>
              <Card>
                <Card.Header>
                  <Card.Title>{day}</Card.Title>
                </Card.Header>
                <Card.Body className="text-center p-0">
                  <div>
                    {state.tasks.length !== 0 ? (
                      state.tasks.map((task) => {
                        return (
                          <div>
                            <Card.Text>{task.taskName}</Card.Text>
                            <Card.Text>{task.comments}</Card.Text>

                            {task.timelogs?.map((timelog) => {
                              return <Card.Text>{timelog.startTime}</Card.Text>;
                            })}
                          </div>
                        );
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
