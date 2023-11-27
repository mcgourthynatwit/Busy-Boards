import "../styles/TaskLine.css";

export default function TaskLine({
  taskName = "THIS IS A REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY LONG NAME",
  assignee = "Hubert Wolfeschlegelsteinhausenbergerdorff",
  priority = "-",
  taskLength = 1,
}) {
  //stops whiteboard click from activating the Edit Task Popup
  const ignoreParentOnClick = (e) => e.stopPropagation();
  return (
    <>
      <div className="taskLine">
        <div className="taskLineMain">
          <div className="taskName">{taskName}</div>
          <div className="assignee">{assignee}</div>
        </div>
        <div className="taskLineBubbles">
          {decidePriority(priority)}
          <div className="bubbleTaskLength">{decideTaskLength(taskLength)}</div>
        </div>
      </div>
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
