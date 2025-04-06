import { useState, useRef, useEffect } from "react";
import Artist from "./Artist";
import Guess from "./Guess";
import Canvas from "./Canvas";

const Play = () => {
  const canvasRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState("brush");
  const [fillColorChecked, setFillColorChecked] = useState(false);
  const [brushWidth, setBrushWidth] = useState(5);
  const [renderColor, setRenderColor] = useState(`#000`);
  

  return (
    <>
      <Canvas
        selectedTool={ selectedTool }
        fillColorChecked={ fillColorChecked }
        brushWidth={ brushWidth }
        renderColor={ renderColor }
        canvasRef={ canvasRef }
        setSelectedTool={ setSelectedTool }
        setFillColorChecked={ setFillColorChecked }
        setBrushWidth={ setBrushWidth }
        setRenderColor={ setRenderColor }
      />
      <Artist
        setSelectedTool={ setSelectedTool }
        setFillColorChecked={ setFillColorChecked }
        setBrushWidth={ setBrushWidth }
        setRenderColor={ setRenderColor }
      />
      <Guess />

    </>
  )
}
export default Play