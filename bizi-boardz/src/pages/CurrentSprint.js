import "../styles/CurrentSprint.css";
import TaskCard from "../components/TaskCard.js";
import Column from "../components/Column.js";

export default function CurrentSprint() {
  return (
    <div className="pageCurrentSprint">
      <div className="pageHeader">Example Project Name (Grab from GitHub?)</div>
      <div className="pageBody">
        <Column columnHeader={"To Do"} />
        <Column columnHeader={"In Progress"} />
        <Column columnHeader={"Done"} />
      </div>
    </div>
  );
}
