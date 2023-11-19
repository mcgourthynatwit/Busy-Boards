import "../styles/CurrentSprint.css";
import TaskCard from "../components/TaskCard.js";

export default function CurrentSprint() {
  return (
    <div className="pageCurrentSprint">
      <div className="pageHeader">Example Project Name (Grab from GitHub?)</div>
      <div className="pageBody">
        <div className="progressColumn">
          <div className="columnHeader">To Do</div>
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
          <div className="columnHeader">In Progress</div>
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
          <div className="columnHeader">Done</div>
          <div className="columnBody">
            <ul>
              <TaskCard
                taskName="THIS IS A TEST STORY NAME"
                assignee="Tim Magee"
                isStory={true}
                priority={3}
                taskLength={10.5}
              />
              <TaskCard priority={2} />
              <TaskCard priority={1} />
              <TaskCard priority={-1} />
              <TaskCard taskName="THIS IS A REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY LONG NAME" />
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
