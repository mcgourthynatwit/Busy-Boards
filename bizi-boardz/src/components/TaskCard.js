import "../styles/TaskCard.css";

//display task name, assignee, story/task, priority (!, !!, !!!), length
export default function TaskCard({
  taskName = "Aliqua ut mollit laborum deserunt in.Occaecat ea occaecat ullamco labore.",
  assignee = "Hubert Wolfeschlegelsteinhausenbergerdorff",
  isStory = false,
  priority = -1,
  taskLength = 1,
}) {
  return (
    <div className="taskCard">
      <div className="taskCardHeader">
        <div className="taskName">{taskName}</div>
        <div className="assignee">{assignee}</div>
      </div>
      <div className="taskCardFooter">
        {decideStoryTask(isStory)}
        <div className="EMPTY_DIV_ON_PURPOSE"></div>
        {decidePriority(priority)}
        <div className="bubbleTaskLength">{decideTaskLength(taskLength)}</div>
      </div>
    </div>
  );
}

function decideStoryTask(isStory) {
  if (isStory) return <div className="bubbleStory">S</div>;
  else return <div className="bubbleTask">T</div>;
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
