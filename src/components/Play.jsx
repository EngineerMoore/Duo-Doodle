import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { socket } from "../socket";
import DrawTools from "./DrawTools";
import Guess from "./Guess";
import Canvas from "./Canvas";
import { faker } from "@faker-js/faker"

const Play = ({correctAnswer, setCorrectAnswer, wrongAnswers, setWrongAnswers}) => {
  const canvasRef = useRef(null);
  const Ref = useRef(null);
  const [selectedTool, setSelectedTool] = useState('brush');
  const [fillColorChecked, setFillColorChecked] = useState(false);
  const [brushWidth, setBrushWidth] = useState(5);
  const [renderColor, setRenderColor] = useState('#000');
  const [player, setPlayer] = useState('artist');
  const [timer, setTimer] = useState('2:00');
  const navigate = useNavigate();

  const handleTopicClick = () => {
    const topics = [
      'animal.type',
      'commerce.department',
      'commerce.product',
      'commerce.productMaterial',
      'food.fruit',
      'food.vegetable',
      'location.continent',
      'location.country',
      'person.sex',
      'vehicle.manufacturer',
      'vehicle.type',
      'word.noun',
    ]
    const fakerMethods = {
      'animal.type': faker.animal.type,
      'commerce.department': faker.commerce.department,
      'commerce.product': faker.commerce.product,
      'commerce.productMaterial': faker.commerce.productMaterial,
      'food.fruit': faker.food.fruit,
      'food.vegetable': faker.food.vegetable,
      'location.continent': faker.location.continent,
      'location.country': faker.location.country,
      'person.sex': faker.person.sex,
      'vehicle.manufacturer': faker.vehicle.manufacturer,
      'vehicle.type': faker.vehicle.type,
      'word.noun': faker.word.noun,
    };

    const topicIdx = Math.floor(Math.random() * topics.length);
    const topic = fakerMethods[topics[topicIdx]]();
    socket.emit('correct', topic)
    setCorrectAnswer(topic);
  }


  useEffect(() => {
    socket.on('artist', () => {
      setPlayer('artist');
    });

    socket.on('guesser', () => {
      setPlayer('guesser')
    })

    socket.on('correct', answer => {
      setCorrectAnswer(answer);
    })

    const getWrongAnswers = (answers) => {
      setWrongAnswers(answers);
    }

    socket.on('renderResults', () => {navigate("/results")});
    socket.on('wrong', getWrongAnswers);

    return () => {
      socket.off('artist');
      socket.off('guesser');
      socket.off('correct')
      socket.off('renderResults');
      socket.off('wrong');
      }
  }, [])

  useEffect(() => {
    if (player === 'artist') handleTopicClick();

    let timeRemaining = 120;

    const timeDecrement = () => {
      if (timeRemaining <= 0) {
        setTimer('0:00');
        clearInterval(startTimer);
        return;
      }

      if (timeRemaining <= 30) {
        const addAlert = () => {
          const timerElement = document.querySelector('.timer');
          timerElement.id = "timer-alert";
          Ref.current = timerElement.id;
        };
        if (!Ref.current) addAlert();
      }

      timeRemaining--;

      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;

      const clock = `${minutes}:${seconds > 9 ? seconds : `0${seconds}`}`;
      setTimer(clock);

    }

    const startTimer = setInterval(timeDecrement, 1000);

    return () => clearInterval(startTimer);
  }, []);


  if (timer === '0:00') {
    socket.emit('renderResults');
  };



  return (
    <>
      <h1 id = 'prompt'>{
        player === 'artist' ?
        'Your turn to draw!':
        'Guess the drawing' 
      }</h1>
      <h2 id = 'topic' >{
        player === 'artist' ?
        'Topic: ' + correctAnswer:
        '' 
      }</h2>
      <div className={`play-container ${player === "artist"? "artist-view" : "guesser-view"}`}>
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
      { player === 'artist' ?      
        <DrawTools
          selectedTool={ selectedTool }
          setSelectedTool={ setSelectedTool }
          setFillColorChecked={ setFillColorChecked }
          setBrushWidth={ setBrushWidth }
          setRenderColor={ setRenderColor }
          canvasRef={ canvasRef }
          handleTopicClick={handleTopicClick}
        /> :
        <Guess
          wrongAnswers={ wrongAnswers }
          setWrongAnswers={ setWrongAnswers }
          correctAnswer={ correctAnswer }
        />
      }
      </div>
      <p className="timer">{timer}</p>

    </>
  )
}
export default Play