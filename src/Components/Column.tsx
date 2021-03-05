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
import Card from "./Card";
import { State } from '../Scripts/GlobalState';

export default function Column() {
    let { state, setState, getItems, reorder, move, } = State.useContainer();

    function onDragEnd(result: DropResult) {
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

            setState(newState.filter((group) => group.length));
        }
    }

    return (
        <div>
            <button
                type="button"
                onClick={() => {
                    setState([...state, []]);
                }}
            >
                Add new group
      </button>
            <button
                type="button"
                onClick={() => {
                    setState([...state, getItems(1)]);
                }}
            >
                Add new item
      </button>
            <div style={{ display: "flex" }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Card></Card>
                </DragDropContext>
            </div>
        </div>
    );
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<Column />, rootElement);
