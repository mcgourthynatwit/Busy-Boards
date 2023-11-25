import "../styles/PopupEditTask.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faFloppyDisk,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import CustomInput from "./CustomInput.js";

//trigger decides if the popup is visible
//setTrigger takes in setEditTaskPopup from TaskCard.js, which changes the trigger variable
export default function PopupEditTask({
  trigger,
  setTrigger,
  taskName = "This is a test",
  assignee,
  priority,
  taskLength,
}) {
  //stops inner popup click from closing the popup
  const ignoreParentOnClick = (e) => e.stopPropagation();

  return trigger ? (
    <div className="popup" onClick={() => setTrigger(false)}>
      <div className="popup-inner" onClick={(e) => ignoreParentOnClick(e)}>
        <div className="popup-header">
          Edit Task Details
          <button className="close-btn" onClick={() => setTrigger(false)}>
            <FontAwesomeIcon icon={faXmark} style={{ height: "100%" }} />
          </button>
        </div>
        <div className="popup-body">
          <div className="task-name-section">
            Task Name:
            <input type="text" defaultValue={taskName}></input>
          </div>
          <div className="assignee-section">
            Assignee:
            <input type="text" defaultValue={assignee}></input>
          </div>
          <div className="dropdowns-row">
            <div className="progress-section">
              Current Progress:
              <select>
                <option>-</option>
                <option>0%</option>
                <option>10%</option>
                <option>20%</option>
                <option>30%</option>
                <option>40%</option>
                <option>50%</option>
                <option>60%</option>
                <option>70%</option>
                <option>80%</option>
                <option>90%</option>
                <option>100%</option>
              </select>
            </div>
            <div className="priority-section">
              Priority:
              <select>
                <option>-</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
            </div>
            <div className="task-length-section">
              Task Length:
              <select>
                <option>-</option>
                <option>0.5</option>
                <option>1</option>
                <option>1.5</option>
                <option>2</option>
                <option>2.5</option>
                <option>3</option>
                <option>3.5</option>
                <option>4</option>
                <option>4.5</option>
                <option>5</option>
                <option>5.5</option>
                <option>6</option>
                <option>6.5</option>
                <option>7</option>
                <option>7.5</option>
                <option>8</option>
                <option>8.5</option>
                <option>9</option>
                <option>9.5</option>
                <option>10</option>
              </select>
            </div>
          </div>
          <div className="description-section">
            Description:<br></br>
            <textarea rows="3"></textarea>
          </div>
        </div>
        <div className="popup-footer">
          <button className="delete-btn">
            <FontAwesomeIcon
              icon={faTrashCan}
              style={{ height: "100%", paddingRight: "6px" }}
            />
            Delete Task
          </button>
          <button className="save-btn">
            <FontAwesomeIcon
              icon={faFloppyDisk}
              style={{ height: "100%", paddingRight: "6px" }}
            />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
// <div className="edit-dropdowns">
//   <div className="progress-section">
//     <span className="field-label">Estimated Progress: </span>
//   </div>
//   <div className="priority-section">
//     Priority:{" "}
//     <select>
//       <option value="a">a</option>
//       <option value="b">b</option>
//     </select>
//   </div>
//   <div className="task-length-section">Task Length:</div>
// </div>
// <div className="description-section">
//   <span className="field-label">Description: </span>
//   <br />
//   <textarea placeholder="Enter a task description..."></textarea>
// </div>
