import React, { CSSProperties } from "react";
import {
  Draggable,
  NotDraggingStyle,
  DraggingStyle,
} from "react-beautiful-dnd";
import { State } from "../Scripts/GlobalState";
import { Button, Card, Modal } from "react-bootstrap";
import { BoardCard } from "../Scripts/GlobalState";

const grid = 10;

export interface ICardProps {
  index: number;
  ind: number;
  card: BoardCard;
}

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
): CSSProperties => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

export const CardComponent: React.FC<ICardProps> = (props) => {
  let { state, setState } = State.useContainer();
  const { card, ind, index } = props;

  return (
    <>
      <Draggable key={card.id} draggableId={card.id} index={ind}>
        {(provided, snapshot) => {
          const itemStyles = getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          );
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="border border-info rounded p-2"
              style={itemStyles}
            >
              <Card
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  background: itemStyles.background,
                  border: "none",
                }}
              >
                <Card.Title>{card.title}</Card.Title>
                <Card.Text>{card.comments}</Card.Text>
                <Card.Body className="text-center p-0">
                  <Button
                    type="button"
                    variant="danger"
                    className="btn-sm w-50"
                    onClick={() => {
                      const newState = [...state];
                      newState[ind].splice(index, 1);
                      setState(newState.filter((group) => group.length));
                    }}
                  >
                    delete
                  </Button>
                </Card.Body>
              </Card>
            </div>
          );
        }}
      </Draggable>
    </>
  );
};
