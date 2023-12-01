import "../styles/PopupStartSprint.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import useTaskUtils from "../backend/tasks/useTaskUtils";

export default function PopupLocation({ trigger, setTrigger }) {
  const ignoreParentOnClick = (e) => e.stopPropagation();

  return trigger ? (
    <>
      <div className="popup-start-sprint" onClick={() => setTrigger(false)}>
        <div
          className="popup-start-sprint-inner"
          onClick={(e) => ignoreParentOnClick(e)}
        >
          <div className="popup-start-sprint-header">
            <div className="header-text">Start A New Sprint?</div>
            <button className="close-btn" onClick={() => setTrigger(false)}>
              <FontAwesomeIcon icon={faXmark} style={{ height: "100%" }} />
            </button>
          </div>
          <div className="popup-start-sprint-body">
            Are you sure you want to start a new sprint? <br />
            <span style={{ marginTop: "8px" }}>
              Doing so will delete all tasks in the current sprint and move
              tasks from the upcoming sprint to the current sprint.
            </span>
          </div>

          <div className="popup-start-sprint-footer">
            <button className="cancel-btn" onClick={() => setTrigger(false)}>
              Cancel
            </button>
            <button className="start-sprint-btn">
              <FontAwesomeIcon
                icon={faPersonRunning}
                style={{ height: "100%", paddingRight: "6px" }}
              />
              Start Sprint
            </button>
          </div>
        </div>
      </div>
    </>
  ) : (
    ""
  );
}
