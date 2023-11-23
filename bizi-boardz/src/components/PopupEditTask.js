import "../styles/PopupEditTask.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
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
          <h1>{taskName}</h1>
          <button className="close-btn" onClick={() => setTrigger(false)}>
            <FontAwesomeIcon icon={faX} style={{ height: "100%" }} />
          </button>
        </div>
        <div className="popup-body">
          <CustomInput></CustomInput>
        </div>
        <div className="popupFooter">
          <button className="delete-btn">Delete Task</button>
          <button className="save-btn">Save Changes</button>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
