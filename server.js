import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import morgan from 'morgan';
import cors from 'cors'

const app = express().use(cors());
const server = createServer(app);
const PORT = process.env.PORT || 3000;


const io = new Server(server, {
  cors: { //required so fronted can reach backend
    origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5173"],
  },
});

const rooms = [];
const playersInfo = {};

io.on('connection', (socket) => {
  let roomId = null;
  socket.on('newPlayer', () => {
    const findOpening = (i, role) => {
      if (!rooms[i][role]) {
        rooms[i][role] = socket.id;
        socket.emit(role);
        roomId = '' + i;
        playersInfo[socket.id] = { room: roomId, role: role, };
        socket.join(roomId);
        return true;
      }
    }

    for (let i = 0; i < rooms.length; i++){
      if (findOpening(i, 'artist')) return;
      if (findOpening(i, 'guesser')) return;
    }
    
    if (rooms.length === 0 || Object.keys(rooms[rooms.length - 1]).length === 2) {
      roomId = '' + rooms.length;

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
       socket.join(roomId);
    }

  });

  
  socket.on('start-drawing', (data) => {
    socket.broadcast.to(playersInfo[socket.id].room).emit('start-drawing', data);
  });
  socket.on('drawing', (position) => {
    socket.broadcast.to(playersInfo[socket.id].room).emit('drawing', position);
  });

  socket.on('correct', (answer) => {
    socket.broadcast.to(playersInfo[socket.id].room).emit('correct', answer);
  })

  socket.on('wrong', (answers) => {
    socket.to(playersInfo[socket.id].room).emit('wrong', answers);
  })

  socket.on('renderResults', () => {
    io.to(playersInfo[socket.id].room).emit('renderResults');
  })
  socket.on('disconnect', (player) => {
    if (!playersInfo[socket.id]) return; 
    const room = playersInfo[socket.id].room;
    const otherRole = playersInfo[socket.id].role === 'artist' ? 'guesser' : 'artist';
    const otherPlayer = rooms[room][otherRole];
    delete playersInfo[socket.id];
    if (otherPlayer) delete playersInfo[otherPlayer];
    delete rooms[room];
  });



});


app.use(morgan);

app.get(`/`, (req, res) => {
  res.send(`Welcome to Duo-Doodle API`);
});


io.listen(PORT);