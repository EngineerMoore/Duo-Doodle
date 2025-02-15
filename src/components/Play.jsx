import { useState, useRef } from "react";
import Artist from "./Artist";
import Guess from "./Guess";

const Play = () => {
  // const Ref = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState("brush");
  const [fillColorChecked, setFillColorChecked] = useState(false);
  const [brushWidth, setBrushWidth] = useState(5);
  const [renderColor, setRenderColor] = useState(`#000`);
  

  return (
    <>
      <Artist
              selectedTool={ selectedTool }
              setSelectedTool={ setSelectedTool }
              setFillColorChecked={ setFillColorChecked }
              setBrushWidth={ setBrushWidth }
              setRenderColor={ setRenderColor }
              // Ref={ Ref }
              ctxRef={ ctxRef }
              canvasRef={ canvasRef }
              fillColorChecked={ fillColorChecked }
              brushWidth={ brushWidth }
              renderColor={ renderColor }
      />
      <Guess />

    </>
  )
}
export default Play