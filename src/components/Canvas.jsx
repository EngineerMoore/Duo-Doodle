import { useRef, useEffect, useState } from "react";


const Canvas = ({ canvasRef, ctxRef, selectedTool, fillColorChecked, brushWidth, renderColor }) => {

  let prevMouseX, prevMouseY, snapshot, isDrawing = false;

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

/*     const connect = () => {
      socket.connect();
      console.log(`connected`);
    } */
    
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
    <canvas id="canvas"
    ref={ canvasRef }
    width={600}
    height={450}></canvas>
  );
};

export default Canvas;