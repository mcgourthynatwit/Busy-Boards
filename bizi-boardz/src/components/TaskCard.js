import "../styles/TaskCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import PopupEditTask from "./PopupEditTask";
import React from "react";
import PopupWhiteboard from "./PopupWhiteboard";

//display task name, assignee, story/task, priority (!, !!, !!!), length
export default function TaskCard({
  taskID = "",
  taskName = "Aliqua ut mollit laborum deserunt in.Occaecat ea occaecat ullamco labore.",
  assignee = "Hubert Wolfeschlegelsteinhausenbergerdorff",
  priority = "-",
  taskLength = 1,
}) {
  const [editTaskPopup, setEditTaskPopup] = useState(false);
  const [whiteboardPopup, setWhiteboardPopup] = useState(false);

  //stops whiteboard click from activating the Edit Task Popup
  const ignoreParentOnClick = (e) => {
    e.stopPropagation();
    setWhiteboardPopup(true);
  };

  return (
    <>
      <div className="taskCard" onClick={() => setEditTaskPopup(true)}>
        <div className="taskCardHeader">
          <div className="taskName">{taskName}</div>
          <div className="assignee">{assignee}</div>
        </div>
        <div className="taskCardFooter">
          <button
            className="bubbleWhiteboard"
            onClick={(e) => ignoreParentOnClick(e)}
          >
            <FontAwesomeIcon icon={faChalkboardUser} />
          </button>
          <div className="EMPTY_DIV_ON_PURPOSE"></div>
          {decidePriority(priority)}
          <div className="bubbleTaskLength">{decideTaskLength(taskLength)}</div>
        </div>
      </div>
      <PopupEditTask
        trigger={editTaskPopup}
        setTrigger={setEditTaskPopup}
        taskID = {taskID}
        taskName={taskName}
        assignee={assignee}
        priority={priority}
        taskLength={taskLength}
      />
      <PopupWhiteboard
        trigger={whiteboardPopup}
        setTrigger={setWhiteboardPopup}
        taskName={taskName}
      />
    </>
  );
}

function decidePriority(priority) {
  if (priority === 1)
    return <div className="bubblePriority priorityLow">!</div>;
  else if (priority === 2)
    return <div className="bubblePriority priorityModerate">! !</div>;
  else if (priority === 3)
    return <div className="bubblePriority priorityHigh">! ! !</div>;
  else return <div className="bubblePriority priorityNA">-</div>;
}

function decideTaskLength(taskLength) {
  if (taskLength <= 0) return "-";
  else return taskLength.toFixed(1).replace(".0", "");
}
