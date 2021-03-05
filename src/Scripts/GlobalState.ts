import React, { CSSProperties, useState } from "react";
import { DraggableLocation, DraggingStyle, DropResult, NotDraggingStyle } from "react-beautiful-dnd";
import { createContainer } from "unstated-next";

 function GlobalState() {
    
    const getItems = (count: number, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map((k) => ({
        id: `item-${k + offset}-${new Date().getTime()}`,
        content: `item ${k + offset}`,
    }));

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
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: { [key: string]: Array<T> } = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
}
const grid = 8;

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

type Board = Card[][];
// 
const [state, setState] = useState<Board>([getItems(10), getItems(5, 10)]);

return{state, setState, getItemStyle, getListStyle, move, reorder, getItems}
}
// const State = createContainer(GlobalState)
export const State = createContainer(GlobalState)
