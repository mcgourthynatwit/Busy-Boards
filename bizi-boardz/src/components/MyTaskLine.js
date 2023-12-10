import "../styles/MyTaskLine.css";

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
  return (
    <>
      <div className="myTaskLine">
        <div className="myTaskLineMain">
          <div className="myTaskName"></div>
          <div className="isInProgress"></div>
          <div className="isInSprint"></div>
        </div>
      </div>
    </>
  );
}
