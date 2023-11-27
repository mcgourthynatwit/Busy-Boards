import "../styles/BacklogSection.css";
import TaskLine from "../components/TaskLine.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function BacklogSection({ sectionHeader = "<< INVALID >>" }) {
  return (
    <>
      <div className="sectionHeader">
        <FontAwesomeIcon
          icon={faChevronDown}
          style={{ paddingRight: "12px" }}
        />
        {sectionHeader}
      </div>
      <div className="sectionBody">
        <TaskLine
          taskName="THIS IS A TEST STORY NAME"
          assignee="Tim Magee"
          priority={3}
          taskLength={9.5}
        />
        <TaskLine priority={2} />
        <TaskLine priority={1} />
        <TaskLine priority={-1} />
        <TaskLine taskName="THIS IS A REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY REALLY LONG NAME" />
        <TaskLine taskLength={3.5} />
        <TaskLine taskLength={0.5} />
        <TaskLine />
        <TaskLine />
        <TaskLine />
      </div>
    </>
  );
}
