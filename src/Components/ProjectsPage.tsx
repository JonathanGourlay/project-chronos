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
import Column from './Column'
import { State } from '../Scripts/GlobalState';


export default function ProjectsPage() {
    return (
        <div>
            <Column></Column>
        </div>
    )
}
