import React, { CSSProperties, useState } from "react";
import ReactDOM from "react-dom";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
    DraggableLocation,
    DraggingState,
    NotDraggingStyle,
    DraggingStyle,
} from "react-beautiful-dnd";
import { State } from '../Scripts/GlobalState';

const grid = 10;

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
const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250,
});


type Card = { id: string; content: string };
// type Board = Card[][];

export default function Card() {
    let { state, setState, getItems } = State.useContainer();

    return <>{
        state.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                        {...provided.droppableProps}
                    >
                        <button
                            type="button"
                            onClick={() => {
                                setState([...state, getItems(1)]);
                            }}
                        >
                            Add new item
      </button>
                        {el.map((item, index) => (
                            <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-around",
                                            }}
                                        >
                                            {item.content}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newState = [...state];
                                                    newState[ind].splice(index, 1);
                                                    setState(
                                                        newState.filter((group) => group.length)
                                                    );
                                                }}
                                            >
                                                delete
                                        </button>

                                        </div>
                                        <p>hihi</p>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

        ))
    }</>
}