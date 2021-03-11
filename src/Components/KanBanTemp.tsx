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

export type BoardCard = { id: string; comments: string; title: string };
export type Column = { id: string; title: string; cards: BoardCard[][] };
export type Board = BoardCard[][];

const grid = 8;

const background = "lightgrey";

function reorder<T>(
  list: Array<T>,
  startIndex: number,
  endIndex: number
): Array<T> {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}
/**
 * Moves an item from one list to another list.
 */
function move<T>(
  source: Array<T>,
  destination: Array<T>,
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const sInd = +droppableSource.droppableId;
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: { [key: string]: Array<T> } = {};
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
  // let { setCardModalVisible, cardModalVisible } = State.useContainer();
  // Creating formState - setting default values

  const [cardModalVisible, setCardModalVisible] = useState<boolean>(false);
  const [columnIndex, setColumnIndex] = React.useState<number>(0);
  //   const [columnState, setColumnState] = React.useState<Column>();
  const [state, setState] = useState<Board>([]);

  const addItemToColumn = (index: number, form: BoardCard) => {
    const newState = [...state];
    // const newState = Array.from(state);
    console.log(newState);
    newState[index].push(form);
    // console.log(newState);
    setState(newState);
  };

  const addColumnToBoard = (index: number, form: Column) => {
    const newState = [...state];
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
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];
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
          setState([...state, []]);
        }}
      >
        Add new group
      </Button>
      <h1>{JSON.stringify(state, null, "  ")}</h1>
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
                    <h1>{ind}</h1>
                    {columnIndex === ind && (
                      <AddCardModal
                        addItemToColumn={addItemToColumn}
                        // formState={formState}
                        // setFormState={setFormState}
                        setColumnState={setColumnIndex}
                        cardId={`${columnIndex} - ${state[columnIndex].length}`}
                        columnIndex={columnIndex}
                        cardModalVisible={cardModalVisible}
                        setCardModalVisible={setCardModalVisible}
                      />
                    )}

                    <Button
                      type="button"
                      variant="danger"
                      className="btn-sm w-50"
                      onClick={() => {
                        setColumnIndex(ind);
                        setCardModalVisible(true);
                        // setColumnState(0);
                      }}
                    >
                      add card
                    </Button>
                    {el.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
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
                                <Card.Title>{item.id}</Card.Title>
                                <Card.Title>{item.title}</Card.Title>
                                {/* <Card.Text>{item.comments}</Card.Text> */}
                                <Card.Body className="text-center p-0">
                                  <Button
                                    type="button"
                                    variant="danger"
                                    className="btn-sm w-50"
                                    onClick={() => {
                                      const newState = [...state];
                                      newState[ind].splice(index, 1);
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
                    ))}
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
