import "../styles/Column.css";
import TaskCard from "./TaskCard";
import { useTaskContext } from "../providers/TaskProvider";
import { useDrop } from "react-dnd";

//task.currentProgress === columnHeader ? ------> only put task card in column if it has the header name
export default function Column({ columnHeader }) {
  const { tasks, updateTask } = useTaskContext();

  const saveTaskChanges = async (taskID, taskName, assignee, description, priority, length, sprintStatus) => {
    const updateError = await updateTask({
      taskID: taskID,
      taskName: taskName,
      assignee: assignee,
      description: description,
      priority: priority,
      length: length,
      currentProgress: columnHeader,
      sprintStatus: sprintStatus,
      });
  }

  //Drag and drop functionality
  const [{ canDrop, isOver }, dropref] = useDrop({
    accept: "task-card",
    drop: ({taskID, taskName, assignee, description, priority, length, currentProgress, sprintStatus}) => {
      let updateSuccess = saveTaskChanges(
        taskID,
        taskName,
        assignee,
        description,
        priority,
        length,
        sprintStatus
      )
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });


  return (
    <div className="progressColumn" ref={dropref}>
      <div className="columnHeader">{columnHeader}</div>
      <div className="columnBody">
        <ul>
          {tasks &&
            tasks.map((task) => {
              if (task.currentProgress === columnHeader && task.sprint === 1) {
                return (
                  <TaskCard
                    key={task.taskID}
                    taskID={task.taskID}
                    taskName={task.name}
                    taskLength={task.length}
                    assignee={task.assignee}
                    priority={task.priority}
                    description={task.description}
                    currentProgress={task.currentProgress}
                    sprintStatus={task.sprint}
                  />
                )
              } else {
                return null
              }
            })}
          {isOver &&
            <div
              style={{
                width: "95%",
                height: "130px",
                padding: "4px",
                border: isOver ? "dashed 3px black" : "  ",
              }}
            />
          }
        </ul>
      </div>
    </div>
  );
}
