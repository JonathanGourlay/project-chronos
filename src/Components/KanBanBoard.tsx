import React, { CSSProperties, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableLocation,
  NotDraggingStyle,
  DraggingStyle,
} from "react-beautiful-dnd";
import { Button, Card } from "react-bootstrap";
// import { State } from "../Scripts/GlobalState";
import AddCardModal from "./AddCardModal";
import AddColumnModal from "./AddColumnModal";
import apiClient from "../API/client/";

export type BoardCard = { id: string; comments: string; title: string };
export type Column = { id: string; title: string; cards: Array<BoardCard> };
export type Board = Column[][];

const grid = 8;

const background = "lightgrey";

function reorder<T>(
  list: Array<T>,
  startIndex: number,
  endIndex: number
): Array<T> {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  console.log(startIndex, endIndex);
  result.splice(endIndex, 0, removed);

  return result;
}
/**
 * Moves an item from one list to another list.
 */
function move(
  source: Array<BoardCard>,
  destination: Array<BoardCard>,
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const sInd = +droppableSource.droppableId;
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  [removed][0].id = `${droppableDestination.droppableId} - ${
    destClone.length + 1
  }`;

  destClone.splice(droppableDestination.index, 0, removed);

  const result: { [key: string]: Array<BoardCard> } = {};
  result[sInd] = sourceClone;
  result[+droppableDestination.droppableId] = destClone;

  return result;
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
  background: isDragging ? "lightgreen" : background,

  // styles we need to apply on draggables
  ...draggableStyle,
});
const getListStyle = (isDraggingOver: boolean): CSSProperties => ({
  background: isDraggingOver ? "lightblue" : background,
  padding: grid,
  width: 250,
});

export const KanbanBoard = () => {
  // Creating formState - setting default values
  const [cardModalVisible, setCardModalVisible] = useState<boolean>(false);
  const [columnModalVisible, setColumnModalVisible] = useState<boolean>(false);
  const [columnIndex, setColumnIndex] = React.useState<number>(0);
  const [state, setState] = useState<Board>([]);
  const getProjects = async () => {
    // const projects = await apiClient.getProject(1);
    // console.log(projects);
  };
  // getProjects();
  React.useEffect(() => {}, [state]);

  const addItemToColumn = (index: number, form: BoardCard) => {
    const newState = [...state];
    newState[index][Number(state[columnIndex].length - 1)].cards.push(form);
  };
  const addColumn = (index: number, form: Column) => {
    setState([
      ...state,
      [{ id: `${form.id}`, title: `${form.title}`, cards: [] }],
    ]);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(
        state[sInd][0].cards,
        source.index,
        destination.index
      );
      const newState = [...state];
      newState[sInd][0].cards = items;
      setState(newState);
    } else {
      const result = move(
        state[sInd][0].cards,
        state[dInd][0].cards,
        source,
        destination
      );
      const newState = [...state];
      newState[sInd][0].cards = result[sInd];
      newState[dInd][0].cards = result[dInd];
      setState(newState);
    }
  };

  return (
    <div>
      <Button
        type="button"
        variant="info"
        className="m-1"
        onClick={() => {
          // setState([...state, []]);
          // setState([
          //   ...state,
          //   [{ id: `${state.length}`, title: "test", cards: [] }],
          // ]);
          setColumnModalVisible(true);
        }}
      >
        Add new group
      </Button>
      <AddColumnModal
        setColumnModalVisible={setColumnModalVisible}
        columnModalVisible={columnModalVisible}
        columnIndex={columnIndex}
        addColumn={addColumn}
      />

      <div style={{ display: "flex" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {state.map((el, ind) => {
            // Constant to create card's Id in format of (ColumnId - CardId)
            // Function for adding an item to a column

            return (
              <Droppable key={ind} droppableId={`${ind}`}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                    {...provided.droppableProps}
                  >
                    {columnIndex === ind && (
                      <AddCardModal
                        addItemToColumn={addItemToColumn}
                        // formState={formState}
                        // setFormState={setFormState}
                        setColumnIndex={setColumnIndex}
                        cardId={`${columnIndex} - ${
                          state[columnIndex][0].cards.length + 1
                        }`}
                        columnIndex={columnIndex}
                        cardModalVisible={cardModalVisible}
                        setCardModalVisible={setCardModalVisible}
                      />
                    )}
                    {el.map((column, colIndex) => {
                      return (
                        <>
                          <h1>{column.title}</h1>
                          <Button
                            type="button"
                            variant="danger"
                            className="btn-sm w-50"
                            onClick={() => {
                              setColumnIndex(ind);
                              setCardModalVisible(true);
                              // setColumnIndex(0);
                            }}
                          >
                            add card
                          </Button>
                          {column.cards.map((card, cardIndex) => {
                            return (
                              <Draggable
                                key={card.id}
                                draggableId={card.id}
                                index={cardIndex}
                              >
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
                                        <Card.Title>{card.id}</Card.Title>
                                        <Card.Title>{card.title}</Card.Title>
                                        <Card.Text>{card.comments}</Card.Text>
                                        <Card.Body className="text-center p-0">
                                          <Button
                                            type="button"
                                            variant="danger"
                                            className="btn-sm w-50"
                                            onClick={() => {
                                              const newState = [...state];
                                              newState[ind].splice(colIndex, 1);
                                              setState(newState);
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
                            );
                          })}
                        </>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
};
