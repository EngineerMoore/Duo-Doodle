import { useRef, useEffect, useState } from "react";
import { socket } from "../socket";


const Canvas = ({ canvasRef, ctxRef, selectedTool, fillColorChecked, brushWidth, renderColor }) => {
  const [prevMouseX, setPrevMouseX] = useState();
  const [prevMouseY, setPrevMouseY] = useState();
  const [snapshot, setSnapshot] = useState();
  const [isDrawing, setIsDrawing] = useState(false);
  const [test, setTest] = useState();


  // const startDrawing = (ctx, e, canvas) => {
  //   setIsDrawing(true);
  //   setPrevMouseX(e.offsetX);
  //   setPrevMouseY(e.offsetY);
  //   ctx.beginPath();
  //   ctx.lineWidth = brushWidth;
  //   ctx.strokeStyle = renderColor;
  //   ctx.fillStyle = renderColor;
  //   setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
  // }
  
  // const drawRect = (ctx, e) => {
  //   const width = e.offsetX - prevMouseX;
  //   const height = e.offsetY - prevMouseY;
  //   if (fillColorChecked) {
  //     return ctx.fillRect(prevMouseX, prevMouseY, width, height);
  //   }
  //   return ctx.strokeRect(prevMouseX, prevMouseY, width, height);
  // }

  // const drawCircle = (ctx, e) => {
  //   ctx.beginPath();
  //   const radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2));
  //   ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  //   return fillColorChecked ? ctx.fill() : ctx.stroke();
  // }

  // const drawTriangle = (ctx, e) => {
  //   ctx.beginPath();
  //   ctx.moveTo(prevMouseX, prevMouseY);
  //   ctx.lineTo(e.offsetX, e.offsetY);
  //   ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  //   ctx.closePath();
  //   ctx.stroke();
  //   fillColorChecked ? ctx.fill() : ctx.stroke();
  // }

  
  // socket.on('draw', data => { 
  //   const canvasSocket = {
  //   width: 600,
  //   height: 450,
  //   }
  //  draw(canvasSocket, data.e) 
  // })
  // // const onDrawingEvent = (data) => {

  // //   socket.on('draw', data => { console.log(data.e.offsetX)/* draw(data.ctx, data.e) */ })
  // // }

  // const draw = (ctx, e) => {
  //   if (!isDrawing) return;
    

  //   ctx.putImageData(snapshot, 0, 0);

  //   if (selectedTool === "brush" || selectedTool === "eraser") {
  //     ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : renderColor;
  //     ctx.lineTo(e.offsetX, e.offsetY);
  //     ctx.stroke();
  //   } else if (selectedTool === "rectangle") {
  //     drawRect(ctx, e);
  //   } else if (selectedTool === "circle") {
  //     drawCircle(ctx, e);
  //   } else drawTriangle(ctx, e);

  //   // if (!emit) return;
  //   const data = { 
  //     e:{
  //       offsetX: e.offsetX,
  //       offsetY: e.offsetY
  //     },
  //     ctx: {
  //       canvas: {
  //         width: ctx.width,
  //         height: ctx.height
  //     }}};
  //   socket.emit('draw', data/* context, e, canvas */);

  // };
  

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    // ctxRef.current = context;

  const startDrawing = (e) => {
    setIsDrawing(true);
    setPrevMouseX(e.offsetX);
    setPrevMouseY(e.offsetY);
    context.beginPath();
    context.lineWidth = brushWidth;
    context.strokeStyle = renderColor;
    context.fillStyle = renderColor;
    setSnapshot(context.getImageData(0, 0, canvas.width, canvas.height));
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

  
  // socket.on('draw', data => { 
  //   const canvasSocket = {
  //   width: 600,
  //   height: 450,
  //   }
  //  draw(data.e) 
  // })
  // const onDrawingEvent = (data) => {

  //   socket.on('draw', data => { console.log(data.e.offsetX)/* draw(data. data.e) */ })
  // }

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

    // if (!emit) return;
    const data = { 
      e:{
        offsetX: e.offsetX,
        offsetY: e.offsetY
      },
    };
    socket.emit('draw', data/* context, e, canvas */);

  };
    
    const handleMouseDown = (e) => startDrawing(e);
    const handleMouseMove = (e) => draw(e);
  
    const handleMouseUp = () => setIsDrawing(false);

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      socket.off(`connection`);
      socket.off(`draw`);
    };
  });

  return (
    <>
    <li>{test}</li>
    <canvas id="canvas"
    ref={ canvasRef }
    width={600}
    height={450}></canvas>
    </>
  );
};

export default Canvas;