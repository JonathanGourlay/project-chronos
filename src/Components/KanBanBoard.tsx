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
  Accordion,
  Button,
  ButtonGroup,
  Card,
  Col,
  Dropdown,
  ListGroup,
  OverlayTrigger,
  Popover,
  Row,
  Spinner,
  Tab,
  Tabs,
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
  BsCheckBox,
  BsPencil,
} from "react-icons/bs";

import {
  ColumnDto,
  ProjectDto,
  TaskDto,
  CreateTask,
  CreateColumn,
  CreateTimeLog,
  ICreateTimeLog,
  UpdateTask,
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

    if (activeUser?.userId) {
      getDbBoards(activeUser.userId);
    }
  }, []);
  React.useEffect(() => {}, [state.boardState]);
  React.useEffect(() => {}, [state?.selectedBoard]);
  React.useEffect(() => {}, [state.boardState]);
  React.useEffect(() => {}, [state?.selectedBoard]);
  React.useEffect(() => {}, [state?.timerStatus]);

  const getDbBoards = async (userId: number) => {
    const boards = await apiClient.getUserProjects(userId);
    setState({ ...state, boards: boards });
  };
  const addItemToColumn = async (index: number, form: TaskDto) => {
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
      <Row>
        <Col
          style={{
            padding: "1rem",

            marginTop: 70,
          }}
        >
          {state.boards ? (
            <>
              <div
                style={{
                  backgroundColor: "#7a848e",
                  height: "100%",
                  position: "fixed",
                  width: "13%",
                  borderRadius: 6,
                }}
              >
                <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
                  <Tab eventKey="home" title="View Projects" active>
                    <ListGroup defaultActiveKey="#link1">
                      {state.boards.map((board) => (
                        <>
                          <ListGroup.Item
                            action
                            onClick={() => {
                              setState({
                                selectedBoard: board,
                              });
                              // modal appears to fill in project information such as timescales
                            }}
                          >
                            {board.projectName}
                          </ListGroup.Item>
                        </>
                      ))}
                    </ListGroup>
                  </Tab>
                </Tabs>
              </div>
            </>
          ) : (
            <></>
          )}
        </Col>
        <Col
          style={{
            width: "85%",
            marginTop: 70,
            paddingLeft: 0,
            marginLeft: 0,
          }}
        >
          <AddColumnModal
            setState={setState}
            columnModalVisible={state.columnModalVisible}
            columnIndex={state.columnIndex}
            addColumn={addColumn}
          />

          <div
            style={{
              position: "fixed",
              width: "100em",
              marginTop: -5,
              zIndex: 1,
              backgroundColor: "#40464b",
            }}
          ></div>
          <div style={{ display: "flex", marginTop: 15 }}>
            {state.selectedBoard ? (
              state.boardState ? (
                <DragDropContext
                  onDragEnd={onDragEnd}
                  onDragStart={onDragStart}
                >
                  {state.selectedBoard !== undefined &&
                  state.selectedBoard.columns !== undefined
                    ? state.selectedBoard.columns.map((column, index) => {
                        // console.log(column);
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
                                style={
                                  (getListStyle(snapshot.isDraggingOver),
                                  {
                                    backgroundColor: "#4c555d",
                                    borderRadius: 6,
                                    color: "white",
                                    margin: 10,
                                    justifyContent: "space-around",
                                    width:
                                      window.innerWidth /
                                      state.selectedBoard.columns!.length,
                                    textAlign: "center",
                                  })
                                }
                                {...provided.droppableProps}
                              >
                                {state.columnIndex === index && (
                                  <AddCardModal
                                    addItemToColumn={addItemToColumn}
                                    setState={setState}
                                    cardId={
                                      state.selectedBoard.columns &&
                                      state.selectedBoard.columns[
                                        state.columnIndex
                                      ].tasks
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
                                                    onMouseEnter={() => {
                                                      setState({
                                                        cardId:
                                                          card.taskId!.toString(),
                                                        card: card,
                                                      });
                                                    }}
                                                    onMouseDown={() => {
                                                      setState({
                                                        cardId:
                                                          card.taskId!.toString(),
                                                        card: card,
                                                      });
                                                    }}
                                                    style={{
                                                      display: "flex",
                                                      justifyContent:
                                                        "space-around",
                                                      background:
                                                        card.points !== 0
                                                          ? itemStyles.background
                                                          : "red",
                                                      border: "none",
                                                      color: "black",
                                                    }}
                                                  >
                                                    <Accordion activeKey="1">
                                                      <Card.Header
                                                        style={{
                                                          display: "flex",
                                                          justifyContent:
                                                            "space-between",
                                                        }}
                                                      >
                                                        <Accordion.Collapse
                                                          eventKey={
                                                            state.card &&
                                                            state.card
                                                              .taskId ===
                                                              card.taskId
                                                              ? "1"
                                                              : "0"
                                                          }
                                                        >
                                                          <h4
                                                            hidden={
                                                              card.taskDone ===
                                                              "true"
                                                            }
                                                          >
                                                            <Timer
                                                              initialTime={1}
                                                              startImmediately={
                                                                false
                                                              }
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
                                                                    <Timer.Days />{" "}
                                                                    :{" "}
                                                                    <Timer.Hours />{" "}
                                                                    :{" "}
                                                                    <Timer.Minutes />{" "}
                                                                    :{" "}
                                                                    <Timer.Seconds />{" "}
                                                                  </div>

                                                                  <br />
                                                                  <div>
                                                                    {state.timerStatus ? (
                                                                      <Button
                                                                        style={{
                                                                          backgroundColor:
                                                                            "transparent",
                                                                        }}
                                                                        hidden={
                                                                          card.points ===
                                                                            0 ||
                                                                          card.taskDone ===
                                                                            "true"
                                                                        }
                                                                        onClick={() => {
                                                                          pause();
                                                                          setState(
                                                                            {
                                                                              timerStatus:
                                                                                false,
                                                                            }
                                                                          );
                                                                        }}
                                                                      >
                                                                        <BsFillPauseFill />
                                                                      </Button>
                                                                    ) : (
                                                                      <Button
                                                                        hidden={
                                                                          card.points ===
                                                                            0 ||
                                                                          card.taskDone ===
                                                                            "true"
                                                                        }
                                                                        onClick={() => {
                                                                          start();
                                                                          setState(
                                                                            {
                                                                              startTime:
                                                                                new Date(),
                                                                              timerStatus:
                                                                                true,
                                                                            }
                                                                          );
                                                                        }}
                                                                        style={{
                                                                          backgroundColor:
                                                                            "transparent",
                                                                          border:
                                                                            "none",
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
                                                                          card.points ===
                                                                            0 ||
                                                                          card.taskDone ===
                                                                            "true"
                                                                        }
                                                                        onClick={async () => {}}
                                                                        style={{
                                                                          backgroundColor:
                                                                            "transparent",
                                                                          border:
                                                                            "none",
                                                                        }}
                                                                      >
                                                                        <BsStop />
                                                                      </Button>
                                                                    </OverlayTrigger>
                                                                    <Button
                                                                      style={{
                                                                        backgroundColor:
                                                                          "transparent",
                                                                        border:
                                                                          "none",
                                                                      }}
                                                                      hidden={
                                                                        card.points ===
                                                                          0 ||
                                                                        card.taskDone ===
                                                                          "true"
                                                                      }
                                                                      onClick={
                                                                        reset
                                                                      }
                                                                    >
                                                                      <BsArrowCounterclockwise />
                                                                    </Button>
                                                                    <Button
                                                                      style={{
                                                                        backgroundColor:
                                                                          "transparent",
                                                                        border:
                                                                          "none",
                                                                      }}
                                                                      hidden={
                                                                        card.taskDone ===
                                                                        "true"
                                                                      }
                                                                      onClick={() => {
                                                                        setState(
                                                                          {
                                                                            cardId:
                                                                              card.taskId?.toString(),
                                                                            card: card,
                                                                            updateCardModalVisible:
                                                                              true,
                                                                            trelloCardId:
                                                                              card.trelloTaskId,
                                                                            columnIndex:
                                                                              column.columnId,
                                                                          }
                                                                        );
                                                                      }}
                                                                    >
                                                                      <BsPencil />
                                                                    </Button>
                                                                  </div>
                                                                </React.Fragment>
                                                              )}
                                                            </Timer>
                                                          </h4>
                                                        </Accordion.Collapse>
                                                      </Card.Header>
                                                    </Accordion>

                                                    <Card.Body className="text-center p-0">
                                                      <Button
                                                        style={{
                                                          backgroundColor:
                                                            "transparent",
                                                          borderColor: "green",
                                                        }}
                                                        hidden={
                                                          card.taskDone ===
                                                          "true"
                                                        }
                                                        onClick={() => {
                                                          card.taskDone =
                                                            "true";
                                                          const request =
                                                            new UpdateTask(
                                                              card
                                                            );
                                                          request.taskDone =
                                                            "true";
                                                          request.pointsTotal =
                                                            card.points;
                                                          request.addedPoints =
                                                            card.addedPoints;
                                                          apiClient.updateTask(
                                                            request
                                                          );
                                                          setState({
                                                            columnIndex: index,
                                                          });
                                                        }}
                                                        variant="success"
                                                      >
                                                        <BsCheckBox />
                                                      </Button>

                                                      <Card.Title>
                                                        {card.points} Points
                                                      </Card.Title>

                                                      <Card.Title>
                                                        {card.taskName}
                                                      </Card.Title>
                                                      <Card.Text
                                                        style={{
                                                          maxHeight: 100,
                                                          padding: 10,
                                                          overflow: "auto",
                                                        }}
                                                      >
                                                        {card.comments}
                                                      </Card.Text>
                                                    </Card.Body>
                                                    <Card.Footer
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "space-between",
                                                      }}
                                                    >
                                                      <Button
                                                        hidden={
                                                          card.taskDone ===
                                                          "true"
                                                        }
                                                        type="button"
                                                        variant="danger"
                                                        className="btn-sm w-50"
                                                        onClick={() => {
                                                          setState((prev) => {
                                                            const newState =
                                                              prev;
                                                            if (
                                                              newState.selectedBoard &&
                                                              newState
                                                                .selectedBoard
                                                                .columns
                                                            ) {
                                                              newState.selectedBoard.columns[
                                                                index
                                                              ].tasks?.splice(
                                                                cardIndex,
                                                                1
                                                              );
                                                            }
                                                            return newState;
                                                          });
                                                        }}
                                                      >
                                                        <BsTrash />
                                                      </Button>
                                                      <Button
                                                        hidden={
                                                          card.points === 0 ||
                                                          card.taskDone ===
                                                            "true"
                                                        }
                                                        type="button"
                                                        variant="success"
                                                        className="btn-sm w-50"
                                                        style={{
                                                          width: 40,
                                                        }}
                                                        onClick={() => {
                                                          setState({
                                                            assignModalVisible:
                                                              true,
                                                            card: card,
                                                          });
                                                        }}
                                                      >
                                                        <BsPersonPlus />
                                                      </Button>
                                                    </Card.Footer>
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
              )
            ) : undefined}
          </div>
        </Col>
      </Row>
    </div>
  );
};
