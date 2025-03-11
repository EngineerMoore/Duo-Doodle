import { useState, useRef, useEffect } from "react";
import { socket } from "../socket";
import Artist from "./Artist";
import Guess from "./Guess";
import Canvas from "./Canvas";

const Play = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState("brush");
  const [fillColorChecked, setFillColorChecked] = useState(false);
  const [brushWidth, setBrushWidth] = useState(5);
  const [renderColor, setRenderColor] = useState(`#000`);
  
  // useEffect(() => {
  //   const connect = () => {
  //     socket.connect();
  //     console.log(`connected`);
  //   }
  // }, [])

  return (
    <>
                  <Canvas
              selectedTool={ selectedTool }
              fillColorChecked={ fillColorChecked }
              brushWidth={ brushWidth }
              renderColor={ renderColor }
              ctxRef={ ctxRef }
              canvasRef={ canvasRef }
            />
      <Artist
              // selectedTool={ selectedTool }
              setSelectedTool={ setSelectedTool }
              setFillColorChecked={ setFillColorChecked }
              setBrushWidth={ setBrushWidth }
              setRenderColor={ setRenderColor }
              // ctxRef={ ctxRef }
              // canvasRef={ canvasRef }
              // fillColorChecked={ fillColorChecked }
              // brushWidth={ brushWidth }
              // renderColor={ renderColor }
      />
      <Guess 
      />

    </>
  )
}
export default Play