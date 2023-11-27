import "../styles/ViewBacklog.css";
import BacklogSection from "../components/BacklogSection.js";
import PopupNewTask from "../components/PopupNewTask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonRunning, faBullseye } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useState } from "react";

export default function ViewBacklog() {
  const [newTaskPopup, setNewTaskPopup] = useState(false);

  return (
    <>
      <div className="pageViewBacklog">
        <div className="backlogHeader">
          comp4960-fall2023-project-biziboyz-group-2 (Grab from GitHub?)
          <div className="headerButtons">
            <button className="btnNewSprint">
              <FontAwesomeIcon
                icon={faPersonRunning}
                style={{ paddingRight: "4px" }}
              />
              New Sprint
            </button>
            <button
              className="btnNewTask"
              onClick={() => setNewTaskPopup(true)}
            >
              <FontAwesomeIcon
                icon={faBullseye}
                style={{ paddingRight: "4px" }}
              />
              New Task
            </button>
          </div>
        </div>
        <div className="backlogBody">
          <BacklogSection sectionHeader="This Sprint" />
          <BacklogSection sectionHeader="Upcoming Sprint" />
          <BacklogSection sectionHeader="Backlog" />
        </div>
      </div>
      <PopupNewTask trigger={newTaskPopup} setTrigger={setNewTaskPopup} />
    </>
  );
}
