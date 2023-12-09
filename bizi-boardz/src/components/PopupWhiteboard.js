import "../styles/PopupWhiteboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faArrowPointer,
  faMinus,
  faSquareFull,
  faFont,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { React, useEffect, useLayoutEffect, useState, useRef } from "react";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

//trigger decides if the popup is visible
export default function PopupWhiteboard({ trigger, setTrigger, taskName }) {
  const [color, setColor] = useState("white");
  const [elements, setElements] = useState([]);
  const [action, setAction] = useState("none");
  const [tool, setTool] = useState("line"); //line originally
  const [selectedElement, setSelectedElement] = useState(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPanMousePosition, setStartPanMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const textAreaRef = useRef();

  const canvasMargin = window.innerWidth * 0.02;

  let colorToHex = {
    white: "#E7E5DF",
    red: "red",
    blue: "dodgerblue",
    green: "limegreen",
  };

  function createElement(id, x1, y1, x2, y2, type) {
    let roughElement;
    if (type === "line")
      //startX, startY, endX, endY
      roughElement = generator.line(x1, y1, x2, y2, {
        stroke: `${colorToHex[color]}`,
      });
    else if (type === "rectangle")
      //startX, startY, width, height
      roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
        stroke: `${colorToHex[color]}`,
      });
    else if (type === "ellipse")
      //centerX, centerY, width, height
      roughElement = generator.ellipse(x1, y1, 2 * (x2 - x1), 2 * (y2 - y1), {
        stroke: `${colorToHex[color]}`,
      });
    else if (type === "text") {
      return { id, type, x1, y1, x2, y2, text: "" };
    }
    return { id, x1, y1, x2, y2, type, roughElement };
  }

  function isWithinElement(x, y, element) {
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
        1.05
      );
    } else if (type === "text") {
      console.log(type);
      return x >= x1 && x <= x2 && y >= y1 && y <= y2;
    }
  }

  const distance = (a, b) => {
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  };

  function getElementAtPosition(x, y, elements) {
    //finds the first element at position clicked
    return elements.find((element) => isWithinElement(x, y, element));
  }

  //canvas "main" (initializes canvas and draws each element)
  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    if (canvas) {
      const context = canvas.getContext("2d");
      const roughCanvas = rough.canvas(canvas);

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.save();
      context.translate(panOffset.x, panOffset.y);

      elements.forEach((element) => {
        if (action === "writing" && selectedElement.id === element.id) return;
        drawElement(roughCanvas, context, element);
      });
      context.restore();
    }
  }, [trigger, elements, action, selectedElement, panOffset]);

  function drawElement(roughCanvas, context, element) {
    switch (element.type) {
      case "line":
      case "rectangle":
      case "ellipse":
        roughCanvas.draw(element.roughElement);
        break;
      case "text":
        context.font = `24px sans-serif`;
        context.fillStyle = "#E7E5DF";
        context.textBaseline = "top";
        context.fillText(element.text, element.x1, element.y1);
        break;
      default:
        throw new Error(`Type not recognised: ${element.type}`);
    }
  }

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === "writing") {
      setTimeout(() => {
        textArea.focus();
        textArea.value = selectedElement.text;
      }, 0);
    }
  }, [action, selectedElement]);

  useEffect(() => {
    const panFunction = (event) => {
      console.log(event);
      setPanOffset((prevState) => ({
        x: prevState.x - event.deltaX,
        y: prevState.y - event.deltaY,
      }));
    };

    // document.addEventListener("wheel", panFunction);
    // return () => {
    //   document.removeEventListener("wheel", panFunction);
    // };
  }, []);

  //replaces the element at the wanted index with a newer version
  function updateElement(id, x1, y1, x2, y2, type, options) {
    const elementsCopy = [...elements];

    switch (type) {
      case "line":
      case "rectangle":
      case "ellipse":
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
        break;
      case "text":
        const textWidth =
          document
            .getElementById("canvas")
            .getContext("2d")
            .measureText(options.text).width * 2.4;
        const textHeight = 24;
        elementsCopy[id] = {
          ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type),
          text: options.text,
        };
        break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }

    setElements(elementsCopy);
  }

  const getMouseCoordinates = (event) => {
    const offsetX = event.nativeEvent.offsetX - panOffset.x;
    const offsetY = event.nativeEvent.offsetY - panOffset.y;
    return { offsetX, offsetY };
  };

  const handleMouseDown = (event) => {
    // x and y values based on the top left of the canvas
    const { offsetX, offsetY } = getMouseCoordinates(event);

    if (event.button === 2) {
      setAction("panning");
      setStartPanMousePosition({ x: offsetX, y: offsetY });
      return;
    }

    if (action === "writing") return;

    if (tool === "selection") {
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
      setSelectedElement(element);

      setAction(tool === "text" ? "writing" : "drawing");
    }
  };

  const handleMouseMove = (event) => {
    // x and y values based on the top left of the canvas
    const { offsetX, offsetY } = getMouseCoordinates(event);

    if (action === "panning") {
      const deltaX = offsetX - startPanMousePosition.x;
      const deltaY = offsetY - startPanMousePosition.y;
      setPanOffset((prevStats) => ({
        x: prevStats.x + deltaX,
        y: prevStats.y + deltaY,
      }));
      return;
    }

    //change cursor image
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
      //grabbing from state variable
      const { id, x1, x2, y1, y2, type, shapeOffsetX, shapeOffsetY } =
        selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      //keeps shape in place when initially moved
      const newX1 = offsetX - shapeOffsetX;
      const newY1 = offsetY - shapeOffsetY;
      const options = type === "text" ? { text: selectedElement.text } : {};
      updateElement(
        id,
        newX1,
        newY1,
        newX1 + width,
        newY1 + height,
        type,
        options
      );
    }
  };

  const handleMouseUp = (event) => {
    // x and y values based on the top left of the canvas
    const { offsetX, offsetY } = getMouseCoordinates(event);

    if (selectedElement) {
      if (
        selectedElement.type === "text" &&
        offsetX - selectedElement.shapeOffsetX === selectedElement.x1 &&
        offsetY - selectedElement.shapeOffsetY === selectedElement.y1
      ) {
        setAction("writing");
        return;
      }
    }
    if (action === "writing") return;
    setAction("none");
    setSelectedElement(null);
    console.log("mouse up");
  };

  const handleBlur = (event) => {
    console.log("commit changes!");
    const { id, x1, y1, type } = selectedElement;
    setAction("none");
    setSelectedElement(null);
    updateElement(id, x1, y1, null, null, type, { text: event.target.value });
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
              id="text"
              checked={tool === "text"}
              onChange={() => setTool("text")}
            />
            <label htmlFor="text" className="tool-btn">
              <FontAwesomeIcon icon={faFont} style={{ height: "80%" }} />
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
          {action === "writing" ? (
            <textarea
              ref={textAreaRef}
              onBlur={handleBlur}
              style={{
                position: "fixed",
                top: selectedElement.y1 + panOffset.y + 50,
                left: canvasMargin + selectedElement.x1 + panOffset.x + 2,
                font: "24px sans-serif",
                margin: 0,
                padding: 0,
                border: 0,
                outline: 0,
                resize: "none",
                overflow: "hidden",
                whiteSpace: "pre",
                background: "transparent",
                color: "#E7E5DF",
              }}
            />
          ) : null}
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
