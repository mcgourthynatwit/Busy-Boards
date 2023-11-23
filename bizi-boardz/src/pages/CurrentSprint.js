import "../styles/CurrentSprint.css";
import Column from "../components/Column.js";
import PopupEditTask from "../components/PopupEditTask";
import { useState } from "react";

export default function CurrentSprint() {
  const [buttonPopup, setButtonPopup] = useState(false);

  return (
    <>
      <div className="pageCurrentSprint">
        <div className="pageHeader">
          comp4960-fall2023-project-biziboyz-group-2 (Grab from GitHub?)
        </div>
        <div className="pageBody">
          <Column columnHeader={"To Do"} />
          <Column columnHeader={"In Progress"} />
          <Column columnHeader={"Done"} />
        </div>
      </div>
    </>
  );
}
