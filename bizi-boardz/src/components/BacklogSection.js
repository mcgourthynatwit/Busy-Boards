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
        <TaskLine />
        <TaskLine />
        <TaskLine />
        <TaskLine />
        <TaskLine />
        <TaskLine />
        <TaskLine />
      </div>
    </>
  );
}
