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

io.on('connection', (socket) => {
  console.log('Connected');
  socket.on('start-drawing', (data) => {
    socket.broadcast.emit('start-drawing', data);
  });
  socket.on('drawing', (position) => {
    socket.broadcast.emit('drawing', position);
  });
});


app.use(morgan);

app.get(`/`, (req, res) => {
  res.send(`Welcome to Duo-Doodle API`);
});


io.listen(PORT);