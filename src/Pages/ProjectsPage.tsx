// import Board from "./Board";
import React from "react";
import { Button } from "react-bootstrap";
import { ToastProvider } from "react-toast-notifications";
import GlobalContainer from "../API/GlobalState";
import { AccountModal } from "../Components/AccountModal";
import { KanbanBoard } from "../Components/KanBanBoard";
import { KanbanBoardAdmin } from "../Components/KanBanBoardAdmin";
export default function ProjectsPage() {
  const { activeUser, setActiveUser } = GlobalContainer.useContainer();
  return (
    <div>
      {/* <Board /> */}
      {activeUser && activeUser.role !== "Admin" ? (
        <KanbanBoard></KanbanBoard>
      ) : (
        <KanbanBoardAdmin></KanbanBoardAdmin>
      )}
    </div>
  );
}
