import "../styles/PopupNewTask.css";
import PopupDeleteTask from "./PopupDeleteTask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBullseye } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { React } from "react";

//trigger decides if the popup is visible
//setTrigger takes in setEditTaskPopup from TaskCard.js, which changes the trigger variable
export default function PopupNewTask({ trigger, setTrigger }) {
  //sets up options for progress dropdown
  const progressValues = [
    "-",
    "0%",
    "10%",
    "20%",
    "30%",
    "40%",
    "50%",
    "60%",
    "70%",
    "80%",
    "90%",
    "100%",
  ];
  const progressOptions = progressValues.map((value) => (
    <option>{value}</option>
  ));

  //sets up options for priority dropdown
  const priorityValues = ["-", 1, 2, 3];
  const priorityOptions = priorityValues.map((value) => (
    <option>{value}</option>
  ));

  //sets up options for task length dropdown
  const lengthValues = [
    "-",
    0.5,
    1,
    1.5,
    2,
    2.5,
    3,
    3.5,
    4,
    4.5,
    5,
    5.5,
    6,
    6.5,
    7,
    7.5,
    8,
    8.5,
    9,
    9.5,
    10,
  ];
  const lengthOptions = lengthValues.map((value) => <option>{value}</option>);

  //stops inner popup click from closing the popup
  const ignoreParentOnClick = (e) => e.stopPropagation();

  const [deleteTaskPopup, setDeleteTaskPopup] = useState(false);

  return trigger ? (
    <>
      <div className="new-popup" onClick={() => setTrigger(false)}>
        <div
          className="new-popup-inner"
          onClick={(e) => ignoreParentOnClick(e)}
        >
          <div className="new-popup-header">
            Create New Task
            <button className="close-btn" onClick={() => setTrigger(false)}>
              <FontAwesomeIcon icon={faXmark} style={{ height: "100%" }} />
            </button>
          </div>
          <div className="new-popup-body">
            <div className="new-task-name-section">
              Task Name:
              <input type="text"></input>
            </div>
            <div className="new-assignee-section">
              Assignee:
              <input type="text"></input>
            </div>
            <div className="dropdowns-row">
              <div className="progress-section">
                Current Progress:
                <select>{progressOptions}</select>
              </div>
              <div className="new-priority-section">
                Priority:
                <select>{priorityOptions}</select>
              </div>
              <div className="new-task-length-section">
                Task Length:
                <select>{lengthOptions}</select>
              </div>
            </div>
            <div className="new-description-section">
              Description:<br></br>
              <textarea rows="3"></textarea>
            </div>
          </div>
          <div className="new-popup-footer">
            <button className="create-btn">
              <FontAwesomeIcon
                icon={faBullseye}
                style={{ height: "100%", paddingRight: "6px" }}
              />
              Create Task
            </button>
          </div>
        </div>
      </div>
      <PopupDeleteTask
        trigger={deleteTaskPopup}
        setTrigger={setDeleteTaskPopup}
      />
    </>
  ) : (
    ""
  );
}
