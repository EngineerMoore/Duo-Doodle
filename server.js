import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import morgan from 'morgan';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

const io = new Server(server, {
  cors: { //required so fronted can reach backend
    origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5173"],
  },
});
// receive newPlay
// loop through rooms to find empty space; object.keys(players.length) === 0 or 1;
  // if artist, set user as guesser; vice versa
// if object.keys(rooms[rooms.length - 1]) === 2)
  // create a new room

// Working:
  // emitting data to a default room(not working dynamically)
  // finding vacant spot
  // adding new room while array is empty
  // adding new room while array isn't empty
  // artist, is switching to guesser when new room is added
    // new room is being created after user is already asigned
    // removing players on disconnect
      // Can't test using just roomId variable b/c the roomId is getting updated w/ every connection
        // once roomId is found, I can add socket.id: roomId to playerLocation{}
        // upon disconnnect
          // grab the socket.id of the other player
          // delete the room associated w/ player's Location
          // delete both players' location
// Not working:
  // getting errors due to deletion of disconnected user
    // thinkin about adding in async await

const rooms = [];
const playersInfo = {};


io.on('connection', async (socket) => {
  let roomId = null;
  socket.on('newPlayer', () => {
    const findOpening = (i, role) => {
      if (!rooms[i][role]) {
        rooms[i][role] = socket.id;
        socket.emit(role);
        roomId = '' + i;
        playersInfo[socket.id] = { room: roomId, role: role, }
        return true;
      }
    }

    for (let i = 0; i < rooms.length; i++){
      if (findOpening(i, 'artist')) return;
      if (findOpening(i, 'guesser')) return;
    }
    
    if (rooms.length === 0 || Object.keys(rooms[rooms.length - 1]).length === 2) {
      roomId = '' + (rooms.length);

      const role = Math.ceil(Math.random() * 2);
      if (role === 1) {
        rooms.push({artist: socket.id});
        playersInfo[socket.id] = { room: roomId, role: 'artist', }
        socket.emit('artist');
       } else {
        rooms.push({guesser: socket.id});
        playersInfo[socket.id] = { room: roomId, role: 'guesser', }
        socket.emit('guesser');
       }
    }

  });
  await socket.join(0/* , console.log('joined: ' + roomId ) */);


  socket.on('start-drawing', (data) => {
    socket.broadcast.to(0).emit('start-drawing', data);
  });
  socket.on('drawing', (position) => {
    socket.broadcast.to(0).emit('drawing', position);
  });


  socket.on('disconnect', (player) => {
    if (!playersInfo[socket.id]) return;
    const room = playersInfo[socket.id].room;
    const otherRole = playersInfo[socket.id].role === 'artist' ? 'guesser' : 'artist';
    const otherPlayer = rooms[room][otherRole];
    delete rooms[room];
    delete playersInfo[socket.id];
    if (otherPlayer) delete playersInfo[otherPlayer];
  });
  // console.log(rooms); 

});


app.use(morgan);

app.get(`/`, (req, res) => {
  res.send(`Welcome to Duo-Doodle API`);
});


io.listen(PORT);