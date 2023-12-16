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
const db = require('./db/connection');
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

const gameState = {
  players: [],
  gamecards: [],
};

async function fetchInitialState(gameId) {
  try {
    const playersQuery = 'SELECT * FROM playerlist WHERE gameid = $1';
    const players = await db.any(playersQuery, [gameId]);
    gameState.players = players;
    const gamecardsQuery = 'SELECT * FROM gamecards WHERE gameid = $1';
    const gamecards = await db.any(gamecardsQuery, [gameId]);
    gameState.gamecards = gamecards;
    console.log('Initial Game State:', gameState);
  } catch (error) {
    console.error('Error fetching initial game state:', error);
  }
}
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('set-username', (username) => {
  socket.username = username;
  console.log(`User ${username} connected`);
});

socket.on('card-click', async (data) => {
  try {
    console.log(`${data.username} clicked card ${data.cardId}`);
    updateGameState(data);
    await updateDatabaseGameState(data, db);
    io.emit('update-game-state', gameState);
  } catch (error) {
    console.error('Error handling card click:', error);
  }
});

  socket.on('send-chat-message', (data) => {
    io.emit('chat-message', { username: socket.username, message: data.message });
  });
  
  socket.on('send-chatroom-message', (data) => {
    io.emit('chatroom-message', { username: socket.username, message: data.message });
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

function updateGameState(data) {
  const { username, cardId } = data;

  const player = gameState.players.find((p) => p.username === username);

  if (player) {
    const card = gameState.gamecards.find((c) => c.cardid === parseInt(cardId, 10));

    if (card && card.location === 'deck') {
      card.location = 'bottom-screen'; 
      console.log('Updated Game State:', gameState);
    }
  }
}
async function updateDatabaseGameState(data, db) {
  const { username, cardId } = data;
  const updateQuery = 'UPDATE gamecards SET location = $1 WHERE cardid = $2';
  const updatedLocation = `${username}-hand`;
  await db.none(updateQuery, [updatedLocation, cardId]);
}

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
app.get("/lobby", (request, response) => {
  // Pass the username to the view
  response.render("lobby", { user: request.session.user, username: request.session.username}); 
});

app.get("/game/:gameid", (request, response) => {
  const gameId = request.params.gameid;
  const user = request.session.user;
  response.render("game", { gameId, user: request.session.user, username: request.session.username });
});
const PORT = process.env.PORT || 3000;


server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


app.use((request, response, next) => {
  next(createError(404));
});