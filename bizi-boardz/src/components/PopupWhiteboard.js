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
import axios from "axios";
import { useAuthUtils } from "../backend/octokit/useAuthUtils";

const generator = rough.generator();

const getWhiteboard = (taskID, collectionName) => {
  return axios
    .get(`http://localhost:8080/api/whiteboard`, {
      params: {
        taskID: taskID,
        collectionName: collectionName,
      },
    })
    .then((response) => {
      console.log("Whiteboard data received:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching whiteboard data", error);
      throw error;
    });
};

const callAxios = (whiteboardData, repoName) => {
  console.log("calling axios");
  console.log("data", whiteboardData);
  axios
    .post("http://localhost:8080/api/save", {
      data: whiteboardData,
      collectionName: repoName,
    })

    .then(() => {
      console.log("Data has been sent to the server", repoName);
    })
    .catch((err) => {
      console.log("Internal server error", err);
    });
};

//trigger decides if the popup is visible
export default function PopupWhiteboard({
  trigger,
  setTrigger,
  taskName,
  taskID,
}) {
  const [color, setColor] = useState("white");
  const [elements, setElements] = useState([]);
  const [action, setAction] = useState("none");
  const [tool, setTool] = useState("line"); //line originally
  const [selectedElement, setSelectedElement] = useState(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [startPanMousePosition, setStartPanMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const textAreaRef = useRef();
  const { activeRepo } = useAuthUtils();
  const canvasMargin = window.innerWidth * 0.02;

  useEffect(() => {
    if (trigger) {
      setIsLoading(true);
      getWhiteboard(taskID, activeRepo)
        .then((responseData) => {
          console.log("response data", responseData);
          const transformedData = transformResponseData(responseData);
          setElements(transformedData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    }
  }, [trigger, taskID, activeRepo]);

  const transformResponseData = (responseData) => {
    return responseData.map((item) =>
      createElement(item.id, item.x1, item.y1, item.x2, item.y2, item.type, item.strokeColor, item.text)
    );
  };

  let colorToHex = {
    white: "#E7E5DF",
    red: "red",
    blue: "dodgerblue",
    green: "limegreen",
  };

  function createElement(id, x1, y1, x2, y2, type, strokeColor, text) {
    console.log("Creating element type", type, "id", id, "text", text);
    let roughElement;
    if (type === "line") {
      //startX, startY, endX, endY

      roughElement = generator.line(x1, y1, x2, y2, {
        stroke: `${strokeColor}`,
      });
    } else if (type === "rectangle")
      //startX, startY, width, height
      roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
        stroke: `${strokeColor}`,
      });
    else if (type === "ellipse")
      //centerX, centerY, width, height
      roughElement = generator.ellipse(x1, y1, 2 * (x2 - x1), 2 * (y2 - y1), {
        stroke: `${strokeColor}`,
      });
    else if (type === "text") {
      return { taskID, id, type, x1, y1, x2, y2, text: text ? text : "" };
    }
    return { taskID, id, x1, y1, x2, y2, type, strokeColor, roughElement };
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
    if (canvas && !isLoading) {
      const context = canvas.getContext("2d");
      const roughCanvas = rough.canvas(canvas);

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.save();
      context.translate(panOffset.x, panOffset.y);
      elements.forEach((element) => {
        console.log(element);
        if ((action === "writing" && !(selectedElement.id === element.id)) || action !== "writing"){
          console.log("Drawing element", element);
        drawElement(roughCanvas, context, element);
        }
      });

      context.restore();
    }
  }, [elements, action, selectedElement, panOffset, isLoading]);

  function drawElement(roughCanvas, context, element) {
    switch (element.type) {
      case "line":
        roughCanvas.draw(element.roughElement);
        break;
      case "rectangle":
        roughCanvas.draw(element.roughElement);
        break;
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
        console.log("new line", x1, x2);
        elementsCopy[id] = createElement(
          id,
          x1,
          y1,
          x2,
          y2,
          type,
          colorToHex[color]
        );
      case "rectangle":
      case "ellipse":
        elementsCopy[id] = createElement(
          id,
          x1,
          y1,
          x2,
          y2,
          type,
          colorToHex[color]
        );
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
    console.log("x ", offsetX);
    if (event.button === 2) {
      setAction("panning");
      setStartPanMousePosition({ x: offsetX, y: offsetY });
      return;
    }

    if (action === "writing") return;

    if (tool === "selection") {
      const element = getElementAtPosition(offsetX, offsetY, elements);
      if (element) {
        const shapeOffsetX = offsetX - element.x1;
        const shapeOffsetY = offsetY - element.y1;
        setSelectedElement({ ...element, shapeOffsetX, shapeOffsetY });
        setAction("moving");
      }
    } else {
      const id = elements.length;
      const element = createElement(
        id,
        offsetX,
        offsetY,
        offsetX,
        offsetY,
        tool,
        colorToHex[color]
      );
        console.log("created new text");
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
    console.log("Canvas mouse up selected elem", selectedElement);
    if (selectedElement && selectedElement.type !== "text") {
      selectedElement.x2 = offsetX;
      selectedElement.y2 = offsetY;
      callAxios(selectedElement, activeRepo);
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
  };

  const handleBlur = (event) => {
    const { id, x1, y1, type } = selectedElement;
    callAxios({...selectedElement, text: event.target.value }, activeRepo);
    updateElement(id, x1, y1, null, null, type, { text: event.target.value });
    setSelectedElement(null);
    setAction("none");
  };

  function changeColor(color) {
    setColor(color);
    const tools = document.getElementsByClassName("tool-btn");
    const divider = document.getElementsByClassName("vertical-divider");
    for (let i = 0; i < tools.length; i++) {
      tools[i].className = `tool-btn color-${color}`;
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
              onChange={(e) => setText(e.target.value)}
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
