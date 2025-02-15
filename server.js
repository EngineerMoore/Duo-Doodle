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



app.use(morgan);

app.get(`/`, (req, res) => {
  res.send(`Welcome to Duo-Doodle API`);
});


io.listen(PORT);

app.listen(PORT, () => {
  console.log(`Duo-Doodle is now listening on port ${PORT}`);
});