import "../styles/ViewBacklog.css";
import BacklogSection from "../components/BacklogSection.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonRunning, faBullseye } from "@fortawesome/free-solid-svg-icons";

export default function ViewBacklog() {
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
            <button className="btnNewTask">
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
    </>
  );
}
