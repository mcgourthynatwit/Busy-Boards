import "../styles/PopupWhiteboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faArrowPointer,
  faPencil,
  faEraser,
  faMinus,
  faArrowRight,
  faSquareFull,
  faFont,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { React, useState } from "react";

//trigger decides if the popup is visible
export default function PopupWhiteboard({ trigger, setTrigger, taskName }) {
  function changeColor(color) {
    const tools = document.getElementsByClassName("tool-btn");
    const divider = document.getElementsByClassName("vertical-divider");
    for (let i = 0; i < tools.length; i++) {
      tools[i].className = `tool-btn color-${color}`;
      console.log(tools[i].className);
    }
    divider[0].className = `vertical-divider bg-${color}`;
  }

  return trigger ? (
    <>
      <div className="whiteboard-popup">
        <div className="whiteboard-header">
          <div className="whiteboard-task-name">{taskName}</div>
          <div className="whiteboard-toolbar">
            <div className="tool-btn">
              <FontAwesomeIcon
                icon={faArrowPointer}
                style={{ height: "100%" }}
              />
            </div>
            <div className="tool-btn">
              <FontAwesomeIcon icon={faFont} style={{ height: "100%" }} />
            </div>
            <div className="tool-btn">
              <FontAwesomeIcon icon={faPencil} style={{ height: "100%" }} />
            </div>
            <div className="tool-btn">
              <FontAwesomeIcon icon={faEraser} style={{ height: "100%" }} />
            </div>
            <div className="tool-btn">
              <FontAwesomeIcon icon={faMinus} style={{ height: "100%" }} />
            </div>
            <div className="tool-btn">
              <FontAwesomeIcon icon={faArrowRight} style={{ height: "100%" }} />
            </div>
            <div className="tool-btn">
              <FontAwesomeIcon icon={faSquareFull} style={{ height: "100%" }} />
            </div>
            <div className="tool-btn">
              <FontAwesomeIcon icon={faCircle} style={{ height: "100%" }} />
            </div>
            <div className="vertical-divider"></div>
            <div className="tool-btn">
              <FontAwesomeIcon
                icon={faCircle}
                style={{ color: "#E7E5DF", height: "100%" }}
                onClick={() => changeColor("white")}
              />
            </div>
            <div className="tool-btn">
              <FontAwesomeIcon
                icon={faCircle}
                style={{ color: "red", height: "100%" }}
                onClick={() => changeColor("red")}
              />
            </div>
            <div className="tool-btn">
              <FontAwesomeIcon
                icon={faCircle}
                style={{ color: "dodgerblue", height: "100%" }}
                onClick={() => changeColor("blue")}
              />
            </div>
            <div className="tool-btn">
              <FontAwesomeIcon
                icon={faCircle}
                style={{ color: "limegreen", height: "100%" }}
                onClick={() => changeColor("green")}
              />
            </div>
          </div>
          <button className="close-btn" onClick={() => setTrigger(false)}>
            <FontAwesomeIcon icon={faXmark} style={{ height: "50%" }} />
          </button>
        </div>
        <div className="whiteboard-body"></div>
      </div>
    </>
  ) : (
    ""
  );
}
