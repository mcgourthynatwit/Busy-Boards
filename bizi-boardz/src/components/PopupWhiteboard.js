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

//trigger decides if the popup is visible
export default function PopupWhiteboard({ trigger, setTrigger, taskName }) {
  const [color, setColor] = useState("white");
  const [elements, setElements] = useState([]);
  const [action, setAction] = useState("none");
  const [tool, setTool] = useState("line");
  const [selectedElement, setSelectedElement] = useState(null);

  let colorToHex = {
    white: "#E7E5DF",
    red: "red",
    blue: "dodgerblue",
    green: "limegreen",
  };

  function createElement(id, x1, y1, x2, y2, type) {
    let roughElement;
    if (type === "line")
      roughElement = generator.line(x1, y1, x2, y2, {
        stroke: `${colorToHex[color]}`,
      });
    else if (type === "rectangle")
      roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
        stroke: `${colorToHex[color]}`,
      });
    else if (type === "ellipse")
      roughElement = generator.ellipse(x1, y1, 2 * (x2 - x1), 2 * (y2 - y1), {
        stroke: `${colorToHex[color]}`,
      });
    return { id, x1, y1, x2, y2, type, roughElement };
  }

  function isWithinElement(x, y, element) {
    console.log("isWithinElement()");
    const { type, x1, x2, y1, y2 } = element;
    if (type === "rectangle") {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    } else if (type === "line") {
      const a = { x: x1, y: y1 };
      const b = { x: x2, y: y2 };
      const c = { x, y };
      const offset = distance(a, b) - (distance(a, c) + distance(b, c));
      return Math.abs(offset) < 1;
    } else if (type === "ellipse") {
      console.log(element);
      const radiusX = x2 - x1;
      const radiusY = y2 - y1;
      const centerX = x2 - radiusX;
      const centerY = y2 - radiusY;
      return (
        Math.pow(x - centerX, 2) / Math.pow(radiusX, 2) +
          Math.pow(y - centerY, 2) / Math.pow(radiusY, 2) <=
        1
      );
    }
  }

  const distance = (a, b) =>
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

  function getElementAtPosition(x, y, elements) {
    console.log("getElementsAtPosition()");
    return elements.find((element) => isWithinElement(x, y, element));
  }

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

  function updateElement(id, x1, y1, x2, y2, type) {
    console.log("updateElement()");
    const updatedElement = createElement(id, x1, y1, x2, y2, type);

    const elementsCopy = [...elements];
    elementsCopy[id] = updatedElement;
    setElements(elementsCopy);
  }

  const handleMouseDown = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (tool === "selection") {
      console.log("before getElementAtPosition");
      const element = getElementAtPosition(offsetX, offsetY, elements);
      console.log(element);
      if (element) {
        const shapeOffsetX = offsetX - element.x1;
        const shapeOffsetY = offsetY - element.y1;
        setSelectedElement({ ...element, shapeOffsetX, shapeOffsetY });
        setAction("moving");
      }
    } else {
      console.log("mouse down");

      const id = elements.length;
      const element = createElement(
        id,
        offsetX,
        offsetY,
        offsetX,
        offsetY,
        tool
      );
      setElements((prevState) => [...prevState, element]);

      setAction("drawing");
    }
  };

  const handleMouseMove = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;

    if (tool === "selection") {
      event.target.style.cursor = getElementAtPosition(
        offsetX,
        offsetY,
        elements
      )
        ? "grab"
        : "default";
    }
    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, offsetX, offsetY, tool);
      console.log(offsetX, offsetY);
    } else if (action === "moving") {
      const { id, x1, x2, y1, y2, type, shapeOffsetX, shapeOffsetY } =
        selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      const newX1 = offsetX - shapeOffsetX;
      const newY1 = offsetY - shapeOffsetY;
      updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type);
    }
  };

  const handleMouseUp = () => {
    setAction("none");
    console.log("mouse up");
  };

  function changeColor(color) {
    setColor(color);
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
            {/* <div className="tool-btn">
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
  */}
            <input
              type="radio"
              id="selection"
              checked={tool === "selection"}
              onChange={() => setTool("selection")}
            />
            <label htmlFor="selection" className="tool-btn">
              <FontAwesomeIcon
                icon={faArrowPointer}
                style={{ height: "80%" }}
              />
            </label>
            <input
              type="radio"
              id="line"
              checked={tool === "line"}
              onChange={() => setTool("line")}
            />
            <label htmlFor="line" className="tool-btn">
              <FontAwesomeIcon icon={faMinus} style={{ height: "100%" }} />
            </label>

            <input
              type="radio"
              id="rectangle"
              checked={tool === "rectangle"}
              onChange={() => setTool("rectangle")}
            />
            <label htmlFor="rectangle" className="tool-btn">
              <FontAwesomeIcon icon={faSquareFull} style={{ height: "80%" }} />
            </label>
            <input
              type="radio"
              id="ellipse"
              checked={tool === "ellipse"}
              onChange={() => setTool("ellipse")}
            />
            <label htmlFor="ellipse" className="tool-btn">
              <FontAwesomeIcon icon={faCircle} style={{ height: "80%" }} />
            </label>
            <div className="vertical-divider"></div>
            <div className="color-btn">
              <FontAwesomeIcon
                icon={faCircle}
                style={{ color: "#E7E5DF", height: "100%" }}
                onClick={() => changeColor("white")}
              />
            </div>
            <div className="color-btn">
              <FontAwesomeIcon
                icon={faCircle}
                style={{ color: "red", height: "100%" }}
                onClick={() => changeColor("red")}
              />
            </div>
            <div className="color-btn">
              <FontAwesomeIcon
                icon={faCircle}
                style={{ color: "dodgerblue", height: "100%" }}
                onClick={() => changeColor("blue")}
              />
            </div>
            <div className="color-btn">
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
