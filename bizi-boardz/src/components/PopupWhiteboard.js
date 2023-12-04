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
import { React, useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";
import { create } from "lodash";

const generator = rough.generator();

function createElement(x1, y1, x2, y2) {
  const roughElement = generator.line(x1, y1, x2, y2, { stroke: "white" });
  return { x1, y1, x2, y2, roughElement };
}

//trigger decides if the popup is visible
export default function PopupWhiteboard({ trigger, setTrigger, taskName }) {
  const [elements, setElements] = useState([]);
  const [drawing, setDrawing] = useState(false);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    console.log(canvas);
    if (canvas) {
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);

      const roughCanvas = rough.canvas(canvas);

      elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
    }
  }, [elements]);

  const handleMouseDown = (event) => {
    setDrawing(true);
    console.log("mouse down");

    const { offsetX, offsetY } = event.nativeEvent;
    const element = createElement(offsetX, offsetY, offsetX, offsetY);
    setElements((prevState) => [...prevState, element]);
  };

  const handleMouseMove = (event) => {
    if (!drawing) return;

    const { offsetX, offsetY } = event.nativeEvent;
    const index = elements.length - 1;
    const { x1, y1 } = elements[index];
    const updatedElement = createElement(x1, y1, offsetX, offsetY);

    const elementsCopy = [...elements];
    elementsCopy[index] = updatedElement;
    setElements(elementsCopy);
    console.log(offsetX, offsetY);
  };

  const handleMouseUp = () => {
    setDrawing(false);
    console.log("mouse up");
  };

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
        <div className="whiteboard-body" id="whiteboardBody">
          <canvas
            id="canvas"
            width={window.innerWidth * 0.96}
            height={window.innerHeight - 62}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            Canvas
          </canvas>
        </div>
      </div>
    </>
  ) : (
    ""
  );
}
