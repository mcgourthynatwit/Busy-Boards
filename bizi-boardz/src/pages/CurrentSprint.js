import "../styles/CurrentSprint.css";
import Column from "../components/Column.js";
import { useAuthUtils } from "../backend/octokit/useAuthUtils.js";

export default function CurrentSprint() {
  const { activeRepo } = useAuthUtils();

  return (
    <>
      <div className="pageCurrentSprint">
        <div className="pageHeader">{activeRepo}</div>
        <div className="pageBody">
          <Column columnHeader={"To Do"} />
          <Column columnHeader={"In Progress"} />
          <Column columnHeader={"Done"} />
        </div>
      </div>
    </>
  );
}
