import React from "react";
import "./App.css";
import Navigation from "../src/Components/Navigation";
import { State } from "./Scripts/GlobalState";

function App() {
  return (
    <div>
      <State.Provider>
        <Navigation />
      </State.Provider>
    </div>
  );
}

export default App;
