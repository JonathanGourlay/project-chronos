import React from "react";
import "./App.css";
import Navigation from "../src/Components/Navigation";
import { ToastProvider } from "react-toast-notifications";
import GlobalContainer from "./API/GlobalState";

function App() {
  return (
    <div>
      <GlobalContainer.Provider>
        <ToastProvider placement="bottom-center">
          <Navigation />
        </ToastProvider>
      </GlobalContainer.Provider>
    </div>
  );
}

export default App;
