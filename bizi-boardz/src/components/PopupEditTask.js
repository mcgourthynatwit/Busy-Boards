import "../styles/PopupEditTask.css";
import PopupDeleteTask from "./PopupDeleteTask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faFloppyDisk,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { React } from "react";

//trigger decides if the popup is visible
//setTrigger takes in setEditTaskPopup from TaskCard.js, which changes the trigger variable
export default function PopupEditTask({
  trigger,
  setTrigger,
  taskName = "This is a test",
  assignee,
  priority,
  taskLength,
}) {
  //still needs to have saving functionality
  function saveTaskChanges() {
    setTrigger(false);
  }

  //sets default value for priority dropdown
  const priorityValues = ["-", 1, 2, 3];
  const priorityOptions = priorityValues.map((value) =>
    value === priority ? (
      <option selected>{value}</option>
    ) : (
      <option>{value}</option>
    )
  );

  //sets default value for task length dropdown
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
  const lengthOptions = lengthValues.map((value) =>
    value === taskLength ? (
      <option selected>{value}</option>
    ) : (
      <option>{value}</option>
    )
  );

  //stops inner popup click from closing the popup
  const ignoreParentOnClick = (e) => e.stopPropagation();

  const [deleteTaskPopup, setDeleteTaskPopup] = useState(false);

  return trigger ? (
    <>
      <div className="popup" onClick={() => setTrigger(false)}>
        <div className="popup-inner" onClick={(e) => ignoreParentOnClick(e)}>
          <div className="popup-header">
            Edit Task Details
            <button className="close-btn" onClick={() => setTrigger(false)}>
              <FontAwesomeIcon icon={faXmark} style={{ height: "100%" }} />
            </button>
          </div>
          <div className="popup-body">
            <div className="task-name-section">
              Task Name:
              <input type="text" defaultValue={taskName}></input>
            </div>
            <div className="assignee-section">
              Assignee:
              <input type="text" defaultValue={assignee}></input>
            </div>
            <div className="dropdowns-row">
              <div className="progress-section">
                Current Progress:
                <select>
                  <option>-</option>
                  <option>0%</option>
                  <option>10%</option>
                  <option>20%</option>
                  <option>30%</option>
                  <option>40%</option>
                  <option>50%</option>
                  <option>60%</option>
                  <option>70%</option>
                  <option>80%</option>
                  <option>90%</option>
                  <option>100%</option>
                </select>
              </div>
              <div className="priority-section">
                Priority:
                <select>{priorityOptions}</select>
              </div>
              <div className="task-length-section">
                Task Length:
                <select>{lengthOptions}</select>
              </div>
            </div>
            <div className="description-section">
              Description:<br></br>
              <textarea rows="3"></textarea>
            </div>
          </div>
          <div className="popup-footer">
            <button
              className="delete-btn"
              onClick={() => setDeleteTaskPopup(true)}
            >
              <FontAwesomeIcon
                icon={faTrashCan}
                style={{ height: "100%", paddingRight: "6px" }}
              />
              Delete Task
            </button>
            <button className="save-btn" onClick={() => saveTaskChanges()}>
              <FontAwesomeIcon
                icon={faFloppyDisk}
                style={{ height: "100%", paddingRight: "6px" }}
              />
              Save Changes
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
