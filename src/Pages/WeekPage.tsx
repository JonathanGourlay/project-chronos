import React from "react";
import { Button, Card, Row, Container, Col } from "react-bootstrap";
import apiClient from "../API/client/";

export default function WeekPage() {
  const dow = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const getTasks = async () => {
    const tasks = await apiClient.getUserTasks(1);
    console.log(tasks);
  };
  getTasks();
  return (
    <Container fluid={true}>
      <Row>
        {dow.map((day, index) => {
          return (
            <Col>
              <Card>
                <Card.Title>{day}</Card.Title>
                <Card.Body className="text-center p-0"></Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
