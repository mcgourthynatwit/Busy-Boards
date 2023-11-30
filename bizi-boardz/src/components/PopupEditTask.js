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
import useTaskUtils from "../backend/tasks/useTaskUtils";

//trigger decides if the popup is visible
//setTrigger takes in setEditTaskPopup from TaskCard.js, which changes the trigger variable
export default function PopupEditTask({
  trigger,
  setTrigger,
  taskID,
  ogTaskName,
  ogAssignee,
  ogProgress,
  ogPriority,
  ogTaskLength,
  ogDescription
}) {

  const [taskName, setTaskName] = useState(ogTaskName);
  const [assignee, setAssignee] = useState(ogAssignee);
  const [description, setDescription] = useState(ogDescription);
  const [currentProgress, setCurrentProgress] = useState(ogProgress);
  const [priority, setPriority] = useState(ogPriority);
  const [length, setLength] = useState(ogTaskLength);

  const { updateTask } = useTaskUtils()

  const saveTaskChanges = async () => {
    console.log('updating task... ', ogTaskName, 'to', taskName)
    const updateError = await updateTask({
      taskID: taskID,
      taskName: taskName,
      assignee: assignee,
      description: description,
      priority: priority,
      length: length,
      currentProgress: currentProgress,
      });
    setTrigger(false);
  }

  //sets up options for progress dropdown
  const progressValues = ["To Do", "In Progress", "Done"];
  const progressOptions = progressValues.map((value) =>
    value === ogProgress ? (
      <option selected>{value}</option>
    ) : (
      <option>{value}</option>
    )
  );

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
    value === ogTaskLength ? (
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
              <input 
                type="text" 
                defaultValue={ogTaskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>
            <div className="assignee-section">
              Assignee:
              <input 
                type="text" 
                defaultValue={ogAssignee}
                onChange={(e) => setAssignee(e.target.value)}
              />
            </div>
            <div className="dropdowns-row">
              <div className="progress-section">
                Current Progress:
                <select
                  defaultValue={ogProgress}
                  onChange={(e) => setCurrentProgress(e.target.value)}
                >
                  {progressOptions}
                </select>
              </div>
              <div className="priority-section">
                Priority:
                <select
                  defaultValue={ogPriority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  {priorityOptions}
                </select>
              </div>
              <div className="task-length-section">
                Task Length:
                <select
                  defaultValue={ogTaskLength}
                  onChange={(e) => setLength(e.target.value)}
                >
                  {lengthOptions}
                </select>
              </div>
            </div>
            <div className="description-section">
              Description:<br />
              <textarea 
                rows="3" 
                defaultValue={description} 
                onChange={(e) => setDescription(e.target.value)}
              />
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
        taskID = {taskID}
        trigger={deleteTaskPopup}
        setTrigger={setDeleteTaskPopup}
        taskName = {taskName}
      />
    </>
  ) : (
    ""
  );
}
