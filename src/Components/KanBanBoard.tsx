import React, { CSSProperties } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableLocation,
  NotDraggingStyle,
  DraggingStyle,
} from "react-beautiful-dnd";
import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
  OverlayTrigger,
  Popover,
  Toast,
  ToggleButton,
} from "react-bootstrap";
// import { State } from "../Scripts/GlobalState";

import AddCardModal from "./AddCardModal";
import AddColumnModal from "./AddColumnModal";
import apiClient from "../API/client/";
import { useToasts } from "react-toast-notifications";
import {
  BsPlay,
  BsStop,
  BsPersonPlus,
  BsTrash,
  BsArrowCounterclockwise,
  BsFillPauseFill,
} from "react-icons/bs";

import {
  ColumnDto,
  ProjectDto,
  TaskDto,
  CreateTask,
  CreateColumn,
  CreateTimeLog,
  ICreateTimeLog,
} from "../API/client/client";
import { useSetState } from "react-use";
import GlobalContainer from "../API/GlobalState";
import Timer from "react-compound-timer/build";

export type BoardCard = TaskDto;
export type Board = ColumnDto[][];

const grid = 8;

const background = "lightgrey";

function reorder<T>(
  list?: Array<BoardCard>,
  startIndex?: number,
  endIndex?: number
): Array<BoardCard> {
  if (
    list !== undefined &&
    startIndex !== undefined &&
    endIndex !== undefined
  ) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    if (startIndex === endIndex) {
      // [removed][0].taskId = result.length + 1;
    }
    result.splice(endIndex, 0, removed);
    return result;
  } else {
    return Array<BoardCard>();
  }
}
/**
 * Moves an item from one list to another list.
 */
function move(
  source?: Array<BoardCard>,
  destination?: Array<BoardCard>,
  droppableSource?: DraggableLocation,
  droppableDestination?: DraggableLocation
) {
  if (
    source !== undefined &&
    destination !== undefined &&
    droppableDestination !== undefined &&
    droppableSource !== undefined
  ) {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const sInd = +droppableSource.droppableId;
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);
    const result: { [key: string]: Array<BoardCard> } = {};
    result[sInd] = sourceClone;
    result[+droppableDestination.droppableId] = destClone;
    apiClient.setColumnTask(
      Number(droppableDestination.droppableId),
      [removed][0].taskId
    );

    return result;
  } else {
    return;
  }
}
const moveTask = async (columnId: number, taskId: number) => {
  await apiClient.moveTask(columnId, taskId);
};
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

export interface stateObject {
  projectModalVisible: boolean;
  cardModalVisible: boolean;
  updateCardModalVisible: boolean;
  assignModalVisible: boolean;
  assignProjectModalVisible: boolean;
  columnModalVisible: boolean;
  columnIndex: number;
  cardId: string;
  trelloCardId: string;
  card: TaskDto;
  boardState: ColumnDto[][];
  boards: ProjectDto[];
  projects: ProjectDto[];
  selectedBoard: ProjectDto;
  counter: number;
  billable: string;
  startTime: Date;
  timerStatus: boolean;
}

export const KanbanBoard = () => {
  const [state, setState] = useSetState<stateObject>();
  const { activeUser, setActiveUser } = GlobalContainer.useContainer();
  const { addToast } = useToasts();

  React.useEffect(() => {
    setState({ columnIndex: 0, boardState: [] });
  }, []);
  React.useEffect(() => {}, [state.boardState]);
  React.useEffect(() => {}, [state?.selectedBoard]);
  React.useEffect(() => {}, [state?.timerStatus]);

  const getDbBoards = async (userId: number) => {
    const boards = await apiClient.getUserProjects(userId);
    setState({ ...state, boards: boards });
  };
  const addItemToColumn = async (index: number, form: TaskDto) => {
    setState((prev) => {
      const newState = prev;
      if (newState.selectedBoard.columns) {
        newState.selectedBoard.columns[index].tasks === undefined
          ? (newState.selectedBoard.columns[index].tasks = new Array<TaskDto>(
              new TaskDto(form)
            ))
          : newState.selectedBoard.columns[index].tasks!.push(
              new TaskDto(form)
            );
      }
      return newState;
    });
    if (state.selectedBoard.columns) {
      const request = new CreateTask();
      request.columnId = state.selectedBoard.columns[index].columnId;
      request.taskName = form.taskName;
      request.comments = form.comments;
      request.startTime = form.startTime;
      request.expectedEndTime = form.expectedEndTime;
      request.endTime = form.expectedEndTime;
      request.pointsTotal = form.points;
      request.addedPointsTotal = form.addedPoints;
      request.addedReason = form.addedReason;
      request.extensionReason = form.extensionReason;
      request.taskArchived = "false";
      request.taskDeleted = "false";
      request.taskDone = "false";
      const addTask = await apiClient.createTask(request);
      addToast(
        <Toast>
          <Toast.Body>Saved!</Toast.Body>
        </Toast>,
        {
          appearance: "success",
          autoDismiss: true,
        }
      );
    }
  };
  const addColumn = async (index: number, form: ColumnDto) => {
    if (state.selectedBoard !== undefined) {
      state.selectedBoard.columns!.push(form);
    } else {
      setState((prev) => {
        const newState = prev;
        newState.selectedBoard = new ProjectDto();
        newState.selectedBoard.columns = [form];
        return newState;
      });
    }

    setState({ columnIndex: state.boardState.length });
    if (state.selectedBoard.columns) {
      const request = new CreateColumn();
      request.projectId = state.selectedBoard.projectId;
      request.columnName = form.columnName;
      request.pointsTotal = form.pointsTotal;
      request.addedPointsTotal = form.addedPoints;
      const addTask = await apiClient.createTask(request);
      addToast(
        <Toast>
          <Toast.Body>Saved!</Toast.Body>
        </Toast>,
        {
          appearance: "success",
          autoDismiss: true,
        }
      );
    }
  };

  const onDragStart = (result: DropResult) => {
    // console.log(result);
  };
  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;
    const dragInd = +draggableId;

    if (state.selectedBoard.columns) {
      const sourceColumn = state.selectedBoard.columns.find(
        (column) => column.columnId === sInd
      );
      const destColumn = state.selectedBoard.columns.find(
        (column) => column.columnId === dInd
      );
      const destColumnIndex = state.selectedBoard.columns.findIndex(
        (column) => column.columnId === dInd
      );
      const sourceColumnIndex = state.selectedBoard.columns.findIndex(
        (column) => column.columnId === sInd
      );
      if (sInd !== dInd) {
        if (
          activeUser?.accessToken &&
          state.cardId &&
          sourceColumn &&
          destColumn &&
          destColumn.tasks === undefined
        ) {
          const t = sourceColumn!.tasks!.find(
            (task) => task.taskId === Number(state.cardId)
          );

          if (t !== undefined) {
            // const res = await addItemToColumn(destColumnIndex, t);
            if (destColumn.columnId && t.taskId)
              moveTask(destColumn.columnId, t.taskId);
            setState((prev) => {
              const newState = prev;
              if (
                newState.selectedBoard?.columns &&
                newState.selectedBoard.columns[sourceColumnIndex].tasks
              ) {
                newState.selectedBoard.columns[sourceColumnIndex].tasks!.map(
                  (task, index) => {
                    if (
                      t.taskId === task.taskId &&
                      newState.selectedBoard.columns &&
                      newState.selectedBoard.columns[sourceColumnIndex].tasks
                    ) {
                      newState.selectedBoard.columns[
                        sourceColumnIndex
                      ].tasks!.splice(index, 1);
                      if (
                        newState.selectedBoard.columns[destColumnIndex]
                          .tasks === undefined
                      ) {
                        newState.selectedBoard.columns[destColumnIndex].tasks =
                          Array<TaskDto>();
                      }
                      newState.selectedBoard.columns[
                        destColumnIndex
                      ].tasks?.push(t);
                    }
                  }
                );
              }
              return newState;
            });
          }
        } else {
          if (
            sourceColumn &&
            destColumn &&
            sourceColumn.tasks &&
            destColumn.tasks &&
            state.cardId
          ) {
            const result = move(
              sourceColumn.tasks,
              destColumn.tasks,
              source,
              destination
            );
            setState((prev) => {
              const newState = prev;
              if (result !== undefined && newState.selectedBoard.columns) {
                const sourechange = newState.selectedBoard.columns.findIndex(
                  (column) => column.columnId === sInd
                );
                const destchange = newState.selectedBoard.columns.findIndex(
                  (column) => column.columnId === dInd
                );

                if (newState.selectedBoard.columns[sourechange] === undefined) {
                  newState.selectedBoard.columns[sourechange].tasks =
                    Array<TaskDto>();
                }
                newState.selectedBoard.columns[sourechange].tasks =
                  result[sInd];
                newState.selectedBoard.columns[destchange].tasks = result[dInd];
              }
              return newState;
            });
          }
        }
      }
    }
  };

  return (
    <div>
      {state.boards ? (
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {state.selectedBoard
              ? state.selectedBoard.projectName
              : "Select Project"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {state.boards.map((board) => (
              <>
                <Dropdown.Item
                  onSelect={() => {
                    setState({ selectedBoard: board });
                  }}
                >
                  {board.projectName}
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
      {/* <Button
        type="button"
        variant="info"
        className="m-1"
        onClick={() => {
          setState({
            columnModalVisible: true,
            columnIndex: state.boardState.length,
          });
        }}
      >
        Add new group
      </Button> */}
      <AddColumnModal
        setState={setState}
        columnModalVisible={state.columnModalVisible}
        columnIndex={state.columnIndex}
        addColumn={addColumn}
      />

      <div style={{ display: "flex" }}>
        {state.boardState ? (
          <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            {state.selectedBoard !== undefined &&
            state.selectedBoard.columns !== undefined
              ? state.selectedBoard.columns.map((column, index) => {
                  // Constant to create card's Id in format of (ColumnId - CardId)
                  // Function for adding an item to a column
                  return (
                    <Droppable
                      key={column.columnId}
                      droppableId={`${column.columnId}`}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                          {...provided.droppableProps}
                        >
                          {state.columnIndex === index && (
                            <AddCardModal
                              addItemToColumn={addItemToColumn}
                              setState={setState}
                              cardId={
                                state.selectedBoard.columns &&
                                state.selectedBoard.columns[state.columnIndex]
                                  .tasks
                                  ? state.selectedBoard.columns[
                                      state.columnIndex
                                    ].tasks!.length
                                  : 0
                              }
                              columnIndex={state.columnIndex}
                              cardModalVisible={state.cardModalVisible}
                              projectStartTime={
                                state.selectedBoard.projectStartTime
                              }
                            />
                          )}

                          <>
                            <h1>{column.columnId}</h1>
                            <h1>{column.columnName}</h1>
                            <Button
                              type="button"
                              variant="danger"
                              className="btn-sm w-50"
                              onClick={() => {
                                setState({
                                  ...state,
                                  cardModalVisible: true,
                                  columnIndex: index,
                                });
                              }}
                            >
                              add card
                            </Button>
                            {column.tasks
                              ? column.tasks!.map((card, cardIndex) => {
                                  return (
                                    <Draggable
                                      key={`${column.columnId} - ${card.taskId}`}
                                      draggableId={`${column.columnId} - ${card.taskId}`}
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
                                              key={card.taskId}
                                              onMouseDown={() => {
                                                setState({
                                                  cardId:
                                                    card.taskId!.toString(),
                                                  card: card,
                                                });
                                              }}
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-around",
                                                background:
                                                  card.points !== 0
                                                    ? itemStyles.background
                                                    : "red",
                                                border: "none",
                                              }}
                                            >
                                              <Card.Header
                                                style={{
                                                  display: "flex",
                                                  justifyContent:
                                                    "space-between",
                                                }}
                                              >
                                                <h4>
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
                                                          <Timer.Days /> :{" "}
                                                          <Timer.Hours /> :{" "}
                                                          <Timer.Minutes /> :{" "}
                                                          <Timer.Seconds />{" "}
                                                        </div>

                                                        <br />
                                                        <div>
                                                          {state.timerStatus ? (
                                                            <Button
                                                              onClick={() => {
                                                                pause();
                                                                setState({
                                                                  timerStatus:
                                                                    false,
                                                                });
                                                              }}
                                                            >
                                                              <BsFillPauseFill />
                                                            </Button>
                                                          ) : (
                                                            <Button
                                                              onClick={() => {
                                                                start();
                                                                setState({
                                                                  startTime:
                                                                    new Date(),
                                                                  timerStatus:
                                                                    true,
                                                                });
                                                              }}
                                                              style={{
                                                                width: 40,
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
                                                                  justifySelf:
                                                                    "space-between",
                                                                }}
                                                              >
                                                                <Popover.Title as="h3">
                                                                  Billable
                                                                  Hours?
                                                                </Popover.Title>
                                                                <Popover.Content
                                                                  style={{
                                                                    textAlign:
                                                                      "center",
                                                                  }}
                                                                >
                                                                  <div>
                                                                    <ButtonGroup
                                                                      toggle
                                                                    >
                                                                      <ToggleButton
                                                                        key={
                                                                          "true"
                                                                        }
                                                                        type="radio"
                                                                        variant="success"
                                                                        name="radio"
                                                                        value={
                                                                          "true"
                                                                        }
                                                                        checked={
                                                                          state.billable ===
                                                                          "true"
                                                                        }
                                                                        onChange={() => {
                                                                          setState(
                                                                            {
                                                                              billable:
                                                                                "true",
                                                                            }
                                                                          );
                                                                        }}
                                                                      >
                                                                        True
                                                                      </ToggleButton>
                                                                      <ToggleButton
                                                                        key={
                                                                          "false"
                                                                        }
                                                                        type="radio"
                                                                        variant="danger"
                                                                        name="radio"
                                                                        value={
                                                                          "false"
                                                                        }
                                                                        checked={
                                                                          state.billable ===
                                                                          "false"
                                                                        }
                                                                        onChange={() => {
                                                                          setState(
                                                                            {
                                                                              billable:
                                                                                "false",
                                                                            }
                                                                          );
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
                                                                            endTime:
                                                                              new Date(),
                                                                            userId:
                                                                              activeUser?.userId,
                                                                            taskId:
                                                                              card.taskId,
                                                                            archived:
                                                                              "false",
                                                                          };

                                                                        console.log(
                                                                          newTimeLog
                                                                        );
                                                                        await apiClient
                                                                          .createTimeLog(
                                                                            new CreateTimeLog(
                                                                              newTimeLog
                                                                            )
                                                                          )
                                                                          .then(
                                                                            () =>
                                                                              reset()
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
                                                              onClick={async () => {}}
                                                            >
                                                              <BsStop />
                                                            </Button>
                                                          </OverlayTrigger>
                                                          <Button
                                                            onClick={reset}
                                                          >
                                                            <BsArrowCounterclockwise />
                                                          </Button>
                                                        </div>
                                                      </React.Fragment>
                                                    )}
                                                  </Timer>
                                                </h4>
                                              </Card.Header>

                                              <Card.Body className="text-center p-0">
                                                <Card.Title>
                                                  {state.counter}
                                                </Card.Title>
                                                <Card.Title>
                                                  {card.points}
                                                </Card.Title>
                                                <Card.Title>
                                                  {card.taskId}
                                                </Card.Title>
                                                <Card.Title>
                                                  {card.taskName}
                                                </Card.Title>
                                                <Card.Text>
                                                  {card.comments}
                                                </Card.Text>
                                              </Card.Body>
                                            </Card>
                                          </div>
                                        );
                                      }}
                                    </Draggable>
                                  );
                                })
                              : null}
                          </>

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  );
                })
              : null}
          </DragDropContext>
        ) : (
          <Button></Button>
        )}
      </div>
    </div>
  );
};
