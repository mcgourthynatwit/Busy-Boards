import "../styles/Column.css";
import TaskCard from "./TaskCard";

export default function Column({ columnHeader }) {
  return (
    <div className="progressColumn">
      <div className="columnHeader">{columnHeader}</div>
      <div className="columnBody">
        <ul>
          <TaskCard
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
          <TaskCard />
        </ul>
      </div>
    </div>
  );
}
