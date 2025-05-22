import { useState } from "react";
import { PiRectangle } from "react-icons/pi";
import { GoCircle } from "react-icons/go";
import { IoTriangleOutline } from "react-icons/io5";
import { BsBrush } from "react-icons/bs";
import { BsEraser } from "react-icons/bs";
import { socket } from "../socket";


const DrawTools = ({
  selectedTool,
  setSelectedTool,
  setFillColorChecked,
  setBrushWidth,
  setRenderColor,
  handleTopicClick
}) => {
  const [brushColor, setBrushColor] = useState(`black`);
  const toolSelection = (tool) => {
    setSelectedTool(tool);
  }

  const handleClearRect = () => {
    socket.emit('clear-drawing');
  }

  const handleFillColor = (e) => {
    e.target.checked ? setFillColorChecked(true) : setFillColorChecked(false);
  };

  const sizeSliderFunction = (e) => {
    setBrushWidth(e.target.value);
  }

  const colorSelection = (color) => {
    setBrushColor(color);
  }

  const showColor = (e) => {
    if (e.target.value){
      e.target.parentElement.style.background = e.target.value;
      return setRenderColor(e.target.value);
    }
    setRenderColor(window.getComputedStyle(e.target).getPropertyValue(`background-color`));
  }

  return (
    <section className="tools-board">
      <div className="row">
        <label className="title">Shapes</label>
        <ul className="options">
          <li
            className={`option tool ${selectedTool === "rectangle" ? "active" : ""}`}
            id="rectangle"
            onClick={() => toolSelection("rectangle")}
          >
            <PiRectangle className="icon" />
            <span>Rectangle</span>
          </li>
          <li
            className={`option tool ${selectedTool === "circle" ? "active" : ""}`}
            id="circle"
            onClick={() => toolSelection("circle")}
          >
            <GoCircle className="icon" />
            <span>Circle</span>
          </li>
          <li
            className={`option tool ${selectedTool === "triangle" ? "active" : ""}`}
            id="triangle"
            onClick={() => toolSelection("triangle")}
          >
            <IoTriangleOutline className="icon" />
            <span>Triangle</span>
          </li>
          <li className="option">
            <label id="fill-color">
              <input type="checkbox" onClick={(e) => handleFillColor(e)}/>
              Fill Color
            </label>
          </li>
        </ul>
      </div>
      <div className="row">
        <label className="title">Options</label>
        <ul className="options">
          <li
            className={`option tool ${selectedTool === "brush" ? "active" : ""}`}
            id="brush"
            onClick={() => toolSelection("brush")}
          >
            <BsBrush className="icon" />
            <span>Brush</span>
          </li>
          <li
            className={`option tool ${selectedTool === "eraser" ? "active" : ""}`}
            id="eraser"
            onClick={() => toolSelection("eraser")}
          >
            <BsEraser className="icon" />
            <span>Eraser</span>
          </li>
          <li
            className="option tool"
            onChange={(e) => sizeSliderFunction(e)}
          >
            <input
              type="range"
              id="size-slider"
              min="1"
              max="30"
            />
          </li>
        </ul>
      </div>
      <div className="row colors">
        <label className="title">Colors</label>
        <ul className="options">
          <li
            className={`option ${brushColor === `white` ? "selected" : ""}`}
            onClick={(e) => {colorSelection(`white`); showColor(e)}}
          >
          </li>
          <li
            className={`option ${brushColor === `black` ? "selected" : ""}`}
            onClick={(e) => {colorSelection(`black`); showColor(e)}}
          >
          </li>
          <li
            className={`option ${brushColor === `red` ? "selected" : ""}`}
            onClick={(e) => {colorSelection(`red`); showColor(e)}}
          >
          </li>
          <li
            className={`option ${brushColor === `green` ? "selected" : ""}`}
            onClick={(e) => {colorSelection(`green`); showColor(e)}}
          >
          </li>
          <li
            className={`option ${brushColor === `custom` ? "selected" : ""}`}
            onClick={(e) => {colorSelection(`custom`); showColor(e)}}
            onChange={(e) => showColor(e)}
          >
            <input type="color" id="color-picker" defaultValue="#0000ff" />
          </li>
        </ul>
      </div>
      <div className="row buttons">
        <button className="clear-canvas" onClick={handleClearRect}>Clear Canvas</button>
        <button className="change-topic" onClick={handleTopicClick}>Change Topic</button>
      </div>
    </section>
  )
}
export default DrawTools