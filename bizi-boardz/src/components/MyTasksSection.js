import "../styles/MyTasksSection.css";
import { useTaskContext } from "../providers/TaskProvider";

export default function MyTasksSection({ sectionHeader = "<<EMPTY_HEADER>>" }) {
  const { tasks } = useTaskContext();
  return (
    <>
      <div className="mytasks-section-header">{sectionHeader}</div>
      <div className="mytasks-section-body">
        <ul>
          <li>{tasks.map((task) => `${task.name}\n`)}</li>
        </ul>
      </div>
    </>
  );
}
