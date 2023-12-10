import "../styles/MyTaskLine.css";
import PopupEditTask from "./PopupEditTask.js";
import { useState } from "react";

export default function MyTaskLine({
  taskID,
  taskName,
  assignee,
  priority,
  taskLength,
  description,
  currentProgress,
  sprintStatus,
}) {
  const [editTaskPopup, setEditTaskPopup] = useState(false);
  const sprintToString = {
    0: "Backlog",
    1: "In Sprint",
    2: "Upcoming Sprint",
  };

  return (
    <>
      <div className="myTaskLine" onClick={() => setEditTaskPopup(true)}>
        <div className="myTaskLineMain">
          <div className="myTaskName">{taskName}</div>
          <div className="isInSprint">{sprintToString[sprintStatus]}</div>
          <div className="isInProgress">{currentProgress}</div>
        </div>
        <div className="taskLineBubbles">
          {decidePriority(priority)}
          <div className="bubbleTaskLength">{decideTaskLength(taskLength)}</div>
        </div>
      </div>
      <PopupEditTask
        trigger={editTaskPopup}
        setTrigger={setEditTaskPopup}
        taskID={taskID}
        ogTaskName={taskName}
        ogAssignee={assignee}
        ogPriority={priority}
        ogTaskLength={taskLength}
        ogProgress={currentProgress}
        ogDescription={description}
        sprint={sprintStatus}
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
  if (isNaN(parseInt(taskLength))) return "-";
  else return taskLength;
}
