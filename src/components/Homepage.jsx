import { useNavigate } from "react-router";
import { socket } from "../socket";
import artistView from "/artist-view.png"
// const artistView = new URL(`/public/artist-view.png`, import.meta.url).href
// const guesserView = new URL(`/guesser-view.png`, import.meta.url).href

const Homepage = ({ token }) => {
  const navigate = useNavigate();

  const play = () => {
    socket.emit('newPlayer');
    navigate("/play");
  }

  return (
    <div className="homepage">
      <h2>Welcome to Duo-Doodle!</h2>
      <button onClick={play}>Play Game</button>

      <h3>Artist</h3>
      <p>
        As the artist, you will be given a prompt. It is your job to make each prompt
        come to life using only your drawing skills! Learn how well you did by
        submitting your drawing. You will know if you created a good representation
        of the prompt if others can guess correctly. Being an artist is fun,
        but no worries, you'll also have the chance to be the guesser.
      </p>
      {/*TODO: add img link */}
      <img alt="screenshot of artist's game view" src={artistView}/>

      <h3>Guesser</h3>
      <p>
        As the guesser, you will let the artist know how well they did! A correct guess means the artist did a great job. But, Hurry! Submit your guess 
        using the submit button before the other guessers have a chance or the timer runs out. The first person to guess correctly wins the round.
        Guessing is fun, but no worries, you'll also have the chance to be the artist.
      </p>
      {/*TODO: add img link */}
      {/* <img alt="screenshot of guesser's game view" src={guesserView} id="guesser-demo"/> */}

      </div>
  )
}
export default Homepage