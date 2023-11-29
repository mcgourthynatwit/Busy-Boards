import "../styles/PopupDeleteTask.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useTaskUtils from "../backend/tasks/useTaskUtils";

import {
  faTriangleExclamation,
  faXmark,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

export default function PopupDeleteTask({ trigger, setTrigger, taskID }) {
  const { delTask } = useTaskUtils();

  //still needs to have delete functionality
  const deleteTask = async ()  => {
    setTrigger(false);
    console.log('deleting task ', taskID)
    const delSuccess = await delTask(taskID)

    // del error go here
    
  }

  return trigger ? (
    <>
      <div className="popup-delete">
        <div className="popup-delete-inner">
          <div className="popup-delete-header">
            <div className="header-text">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                style={{ height: "100% ", paddingRight: "8px" }}
              />
              Delete Task?
            </div>

            <button className="close-btn" onClick={() => setTrigger(false)}>
              <FontAwesomeIcon icon={faXmark} style={{ height: "100%" }} />
            </button>
          </div>
          <div className="popup-delete-body">
            Are you sure you want to delete this task? You cannot undo this
            action.
          </div>
          <div className="popup-delete-footer">
            <button className="cancel-btn" onClick={() => setTrigger(false)}>
              Cancel
            </button>
            <button className="delete-btn" onClick={() => deleteTask()}>
              <FontAwesomeIcon
                icon={faTrashCan}
                style={{ height: "100%", paddingRight: "6px" }}
              />
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </>
  ) : (
    ""
  );
}
