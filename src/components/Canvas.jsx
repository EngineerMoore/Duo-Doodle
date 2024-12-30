import { useRef, useEffect, useState } from "react";
import { PiRectangle } from "react-icons/pi";
import { GoCircle } from "react-icons/go";
import { IoTriangleOutline } from "react-icons/io5";
import { BsBrush } from "react-icons/bs";
import { BsEraser } from "react-icons/bs";

const Canvas = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState("brush");
  const [fillColorChecked, setFillColorChecked] = useState(false);
  const [brushWidth, setBrushWidth] = useState(5);
  const [brushColor, setBrushColor] = useState(`black`);
  const [renderColor, setRenderColor] = useState(`#000`);

  let prevMouseX, prevMouseY, snapshot, isDrawing = false;

  const toolSelection = (tool) => {
    setSelectedTool(tool);
  }

  const clearDrawing = () => {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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

  const startDrawing = (ctx, e, canvas) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = renderColor;
    ctx.fillStyle = renderColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  const drawRect = (ctx, e) => {
    const width = e.offsetX - prevMouseX;
    const height = e.offsetY - prevMouseY;
    if (fillColorChecked) {
      return ctx.fillRect(prevMouseX, prevMouseY, width, height);
    }
    return ctx.strokeRect(prevMouseX, prevMouseY, width, height);
  }

  const drawCircle = (ctx, e) => {
    ctx.beginPath();
    const radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    return fillColorChecked ? ctx.fill() : ctx.stroke();
  }

  const drawTriangle = (ctx, e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    ctx.stroke();
    fillColorChecked ? ctx.fill() : ctx.stroke();
  }

  const draw = (ctx, e) => {
    if (!isDrawing) return;

    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "brush" || selectedTool === "eraser") {
      ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : renderColor;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    } else if (selectedTool === "rectangle") {
      drawRect(ctx, e);
    } else if (selectedTool === "circle") {
      drawCircle(ctx, e);
    } else drawTriangle(ctx, e);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    ctxRef.current = context;

    const handleMouseDown = (e) => startDrawing(context, e, canvas);
    const handleMouseMove = (e) => draw(context, e);
    const handleMouseUp = () => isDrawing = false;

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draw]);

  return (
    <section className="draw-feature">
      <div className="container">
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
            <button className="clear-canvas" onClick={() => clearDrawing()}>Clear Canvas</button>
            <button className="save-img">Save Drawing</button>
          </div>
        </section>
        <canvas id="canvas" ref={canvasRef} width={600} height={450}></canvas>
      </div>
    </section>
  );
};

export default Canvas;