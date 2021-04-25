// import Board from "./Board";
import React from "react";
import { Button } from "react-bootstrap";
import { ToastProvider } from "react-toast-notifications";
import { AccountModal } from "../Components/AccountModal";
import { KanbanBoard } from "../Components/KanBanBoard";
export default function ProjectsPage() {
  return (
    <div>
      {/* <Board /> */}
      <KanbanBoard></KanbanBoard>
    </div>
  );
}
