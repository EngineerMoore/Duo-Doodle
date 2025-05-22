import { useRef, useEffect, useState } from "react";
import { socket } from "../socket";


const Canvas = ({
  canvasRef,
  selectedTool,
  fillColorChecked,
  brushWidth,
  renderColor,
  clearRect,
  setSelectedTool,
  setRenderColor,
  setFillColorChecked,
  setBrushWidth,
  setClearRect
}) => {
  const [prevMouseX, setPrevMouseX] = useState();
  const [prevMouseY, setPrevMouseY] = useState();
  const [snapshot, setSnapshot] = useState();
  const [isDrawing, setIsDrawing] = useState(false);

  const renderColorRef = useRef(renderColor);
  const brushWidthRef = useRef(brushWidth);
  const fillColorCheckedRef = useRef(fillColorChecked);
  
  useEffect(() => {
    renderColorRef.current = renderColor;
  }, [renderColor]);
  
  useEffect(() => {
    fillColorCheckedRef.current = fillColorChecked;
  }, [fillColorChecked]);
  
  useEffect(() => {
    brushWidthRef.current = brushWidth;
  }, [brushWidth]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });

      if (clearRect === true) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setClearRect(false);
      }
   

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
  
    const drawRect = ({offsetX, offsetY}) => {
      const width = offsetX - prevMouseX;
      const height = offsetY - prevMouseY;
      context.lineWidth = brushWidthRef.current;
      if (fillColorCheckedRef.current) {
        context.fillStyle = renderColorRef.current;
        return context.fillRect(prevMouseX, prevMouseY, width, height);
      }
      context.strokeStyle = renderColorRef.current;
      return context.strokeRect(prevMouseX, prevMouseY, width, height);
    }

    const drawCircle = ({offsetX, offsetY}) => {
      context.beginPath();
      const radius = Math.sqrt(Math.pow(prevMouseX - offsetX, 2) + Math.pow(prevMouseY - offsetY, 2));
      context.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
      context.lineWidth = brushWidthRef.current;
      if (fillColorCheckedRef.current) {
        context.fillStyle = renderColorRef.current;
        return context.fill();
      }
      context.strokeStyle = renderColorRef.current;
      return context.stroke();
    }

    const drawTriangle = ({offsetX, offsetY}) => {
      context.beginPath();
      context.moveTo(prevMouseX, prevMouseY);
      context.lineTo(offsetX, offsetY);
      context.lineTo(prevMouseX * 2 - offsetX, offsetY);
      context.closePath();
      context.lineWidth = brushWidthRef.current
      if (fillColorCheckedRef.current) {
        context.fillStyle = renderColorRef.current;
        context.fill();
      } else {
        context.strokeStyle = renderColorRef.current;
        context.stroke();
      }
    }

    
    socket.on('start-drawing', data => {
      if (data.tool !== 'brush' && data.tool !== 'eraser') {
        const snapshotData = context.getImageData(0, 0, canvas.width, canvas.height);
        setSnapshot(snapshotData);
      }

      setSelectedTool(data.tool);
      setRenderColor(data.color);
      renderColorRef.current = data.color;
      setFillColorChecked(data.fill);
      fillColorCheckedRef.current = data.fill;
      setBrushWidth(data.brushWidth);
      brushWidthRef.current = data.brushWidth;
      setPrevMouseX(data.prevMouse.X);
      setPrevMouseY(data.prevMouse.Y);
      context.beginPath();
    });

    socket.on('drawing', (data) => {
      if (selectedTool === "brush" || selectedTool === "eraser") {
        context.lineWidth = brushWidthRef.current;
        context.strokeStyle = selectedTool === "eraser" ? "#fff" : renderColorRef.current;
        context.lineTo(data.offsetX, data.offsetY);
        context.stroke();
      } else {
        if (snapshot) {
          context.putImageData(snapshot, 0, 0);
        }

          if (selectedTool === "rectangle") {
          drawRect(data);
        } else if (selectedTool === "circle") {
          drawCircle(data);
        } else {
          drawTriangle(data);
        }
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
    }
  });

  return (
    <>
    <canvas id="canvas"
    ref={ canvasRef }
    width={600}
    height={450}>Drawing Image</canvas>
    </>
  );
};

export default Canvas;