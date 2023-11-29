import "../styles/ViewBacklog.css";
import BacklogSection from "../components/BacklogSection.js";
import { useAuthUtils } from "../backend/octokit/useAuthUtils.js";
import PopupNewTask from "../components/PopupNewTask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonRunning, faBullseye } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useState } from "react";

export default function ViewBacklog() {
  const [newTaskPopup, setNewTaskPopup] = useState(false);
  const { activeRepo } = useAuthUtils();

  return (
    <>
      <div className="pageViewBacklog">
        <div className="backlogHeader">
          {activeRepo}
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
