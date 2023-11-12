import React from "react";
import "./scss/todolist.scss";
import Todolist from "./components/Todolist";

const App = () => {
  return (
    <div className="container">
      <Todolist />
    </div>
  );
};

export default App;
