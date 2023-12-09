require("dotenv").config();

const path = require("path");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");


const express = require("express");
const app = express();


// Socket.io setup
const http = require('http');
const socket = require('./middleware/socket.js');
const server = http.createServer(app);
socket.init(server);



// Sessions
const session = require('express-session');
const postgreSession = require('connect-pg-simple')(session);
app.use(session({
  store: new postgreSession({
    conObject: {
      connectionString: process.env.DATABASE_URL, // PostgreSQL database configuration from the .env file
      ssl: { rejectUnauthorized: false }
    },
  }),
  secret: 'mysteriousUnoKey',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  ssl: { rejectUnauthorized: false }
}));

const io = require('socket.io')(server);

const users = {}


io.on('connection', socket => {
  console.log('A user connected');
  socket.on('new-user', name=>{
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.emit('chat-message', 'Hello World')
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: 
      users[socket.id] })
  })
  


  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
    console.log('A user disconnected');
  });
});

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "static")));


const rootRoutes = require("./routes/root");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const gameRoutes = require("./routes/game.js")


app.use("/", rootRoutes);
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/game", gameRoutes)
const PORT = process.env.PORT || 3000;


server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


app.use((request, response, next) => {
  next(createError(404));
});
