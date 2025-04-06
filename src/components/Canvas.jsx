import { useEffect, useState } from "react";
import { socket } from "../socket";


const Canvas = ({
  canvasRef,
  selectedTool,
  fillColorChecked,
  brushWidth,
  renderColor,
  setSelectedTool,
  setRenderColor,
  setFillColorChecked,
  setBrushWidth,
}) => {
  const [prevMouseX, setPrevMouseX] = useState();
  const [prevMouseY, setPrevMouseY] = useState();
  const [snapshot, setSnapshot] = useState();
  const [isDrawing, setIsDrawing] = useState(false);

  
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
   

    const startDrawing = (e) => {
      setIsDrawing(true);
      setPrevMouseX(e.offsetX);
      setPrevMouseY(e.offsetY);
      context.beginPath();
      context.lineWidth = brushWidth;
      context.strokeStyle = renderColor;
      context.fillStyle = renderColor;
      setSnapshot(context.getImageData(0, 0, canvas.width, canvas.height));
      const startData = {
        prevMouse:{
          X: e.offsetX,
          Y: e.offsetY,
        },
        tool: selectedTool,
        color: renderColor,
        fill: fillColorChecked,
        brushWidth: brushWidth,
      };
      socket.emit('start-drawing', startData);
    }
  
    const drawRect = (e) => {
      const width = e.offsetX - prevMouseX;
      const height = e.offsetY - prevMouseY;
      if (fillColorChecked) {
        return context.fillRect(prevMouseX, prevMouseY, width, height);
      }
      return context.strokeRect(prevMouseX, prevMouseY, width, height);
    }

    const drawCircle = (e) => {
      context.beginPath();
      const radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2));
      context.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
      return fillColorChecked ? context.fill() : context.stroke();
    }

    const drawTriangle = (e) => {
      context.beginPath();
      context.moveTo(prevMouseX, prevMouseY);
      context.lineTo(e.offsetX, e.offsetY);
      context.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
      context.closePath();
      context.stroke();
      fillColorChecked ? context.fill() : context.stroke();
    }

    
    socket.on('start-drawing', data => {
      setSelectedTool(data.tool);
      setRenderColor(data.color);
      setFillColorChecked(data.fill);
      setBrushWidth(data.brushWidth);
      setPrevMouseX(data.prevMouse.X);
      setPrevMouseY(data.prevMouse.Y);
      context.beginPath()
    })

    socket.on('drawing', (data) => {
      if (selectedTool === "brush" || selectedTool === "eraser") {
        context.lineWidth = brushWidth;
        context.strokeStyle = selectedTool === "eraser" ? "#fff" : renderColor;
        context.lineTo(data.offsetX, data.offsetY);
        context.stroke();
      } else if (selectedTool === "rectangle") {
        drawRect(data);
      } else if (selectedTool === "circle") {
        drawCircle(data);
      } else {
        drawTriangle(data);
      }
    });


    const draw = (e) => {
      if (!isDrawing) return;
      
      context.putImageData(snapshot, 0, 0);

      if (selectedTool === "brush" || selectedTool === "eraser") {
        context.strokeStyle = selectedTool === "eraser" ? "#fff" : renderColor;
        context.lineTo(e.offsetX, e.offsetY);
        context.stroke();
      } else if (selectedTool === "rectangle") {
        drawRect(e);
      } else if (selectedTool === "circle") {
        drawCircle(e);
      } else drawTriangle(e);

      emitDrawing({ offsetX: e.offsetX, offsetY: e.offsetY });  
    };


    const throttle = (callback, delay) => {
      let previousCall = new Date().getTime();
      return function() {
        const time = new Date().getTime();

        if ((time - previousCall) >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    };  
      

    const emitDrawing = throttle((position) => {
      socket.emit('drawing', position);
    }, 20);
  
    const handleMouseDown = (e) => startDrawing(e);
    const handleMouseMove = (e) => draw(e);
  
    const handleMouseUp = (e) => setIsDrawing(false);

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      socket.off(`connection`);
      socket.off(`start-drawing`);
      socket.off(`drawing`);
    };
  });

  return (
    <>
    <canvas id="canvas"
    ref={ canvasRef }
    width={600}
    height={450}></canvas>
    </>
  );
};

export default Canvas;