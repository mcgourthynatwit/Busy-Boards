import "../styles/CurrentSprint.css";
import TaskCard from "../components/TaskCard.js";

export default function CurrentSprint() {
  return (
    <div className="pageCurrentSprint">
      <div className="pageHeader">Example Project Name (Grab from GitHub?)</div>
      <div className="pageBody">
        <div className="progressColumn">
          <div className="columnHeader">
            <h2>To Do</h2>
          </div>
          <div className="columnBody">
            <ul>
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
            </ul>
          </div>
        </div>
        <div className="progressColumn">
          <div className="columnHeader">
            <h2>In Progress</h2>
          </div>
          <div className="columnBody">
            <ul>
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
            </ul>
          </div>
        </div>
        <div className="progressColumn">
          <div className="columnHeader">
            <h2>Done</h2>
          </div>
          <div className="columnBody">
            <ul>
              <TaskCard
                taskName="THIS IS A TEST STORY NAME"
                assignee="Tim Magee"
                isStory={true}
                priority={3}
                taskLength={10.5}
              />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
              <TaskCard />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
