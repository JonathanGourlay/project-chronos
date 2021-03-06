import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { State } from "../Scripts/GlobalState";
import { CardComponent } from "./CardComponent";
import { Button } from "react-bootstrap";
import AddCardModal from "./AddCardModal";

const grid = 10;

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
});

export default function Column() {
  let {
    state,
    setState,
    getItems,
    cardModalVisible,
    setCardModalVisible,
  } = State.useContainer();
  const addItemToColumn = (index: number) => {
    const stateClone = Array.from(state);
    stateClone[index].push(getItems(1)[0]);
    setState(stateClone);
  };
  console.log(state);
  return (
    <>
      {state.map((el, columnIndex) => (
        <Droppable key={columnIndex} droppableId={`${columnIndex}`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              <h1>{columnIndex}</h1>
              <Button
                type="button"
                onClick={() => {
                  addItemToColumn(columnIndex);
                }}
              >
                Add new item
              </Button>
              <Button
                type="button"
                variant="danger"
                className="btn-sm w-50"
                onClick={() => {
                  const newState = [...state];
                  setState(
                    newState.filter((column, index) => index !== columnIndex)
                  );
                }}
              >
                Delete Column
              </Button>
              <Button
                type="button"
                variant="danger"
                className="btn-sm w-50"
                onClick={() => {
                  setCardModalVisible(true);
                }}
              >
                ads Column
              </Button>
              <AddCardModal
                cardModalVisible={cardModalVisible}
                setCardModalVisible={setCardModalVisible}
              />
              {el.map((item, rowIndex) => (
                <CardComponent
                  index={rowIndex}
                  ind={columnIndex}
                  card={item}
                ></CardComponent>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </>
  );
}
