import "../styles/Column.css";
import TaskCard from "./TaskCard";
import useTaskUtils from "../backend/tasks/useTaskUtils";

//task.currentProgress === columnHeader ? ------> only put task card in column if it has the header name
export default function Column({ columnHeader }) {
  const { tasks } = useTaskUtils();
  return (
    <div className="progressColumn">
      <div className="columnHeader">{columnHeader}</div>
      <div className="columnBody">
        <ul>
          {tasks &&
            tasks.map((task) =>
              task.currentProgress === columnHeader ? (
                <TaskCard
                  key={task.taskID}
                  taskID={task.taskID}
                  taskName={task.name}
                  taskLength={task.length}
                  assignee={task.assignee}
                  priority={task.priority}
                />
              ) : (
                ""
              )
            )}
          {/* <TaskCard
            taskName="THIS IS A TEST STORY NAME"
            assignee="Tim Magee"
            priority={3}
            taskLength={9.5}
          />
          <TaskCard priority={2} />
          <TaskCard priority={1} />
          <TaskCard priority={-1} />
          <TaskCard taskName="THIS IS A REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY LONG NAME" />
          <TaskCard taskLength={3.5} />
          <TaskCard taskLength={0.5} />
          <TaskCard />
          <TaskCard />
          <TaskCard /> */}
        </ul>
      </div>
    </div>
  );
}
