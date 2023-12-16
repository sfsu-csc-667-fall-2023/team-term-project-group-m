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
    // Fetch players for the game
    const playersQuery = 'SELECT * FROM playerlist WHERE gameid = $1';
    const players = await db.any(playersQuery, [gameId]);
    gameState.players = players;

    // Fetch game cards for the game
    const gamecardsQuery = 'SELECT * FROM gamecards WHERE gameid = $1';
    const gamecards = await db.any(gamecardsQuery, [gameId]);
    gameState.gamecards = gamecards;

    // Log the initial game state (for demonstration purposes)
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

    // Update the game state in memory (simplified example)
    updateGameState(data);

    // Update the database with the new game state
    await updateDatabaseGameState(data, db);

    // Emit the updated state to all clients
    io.emit('update-game-state', gameState);
  } catch (error) {
    console.error('Error handling card click:', error);
  }
});

  // Event listener for chat messages
  socket.on('send-chat-message', (data) => {
    // Broadcast the message to all connected clients
    io.emit('chat-message', { username: socket.username, message: data.message });
  });
  
  socket.on('send-chatroom-message', (data) => {
    // Broadcast the message to all connected clients
    io.emit('chatroom-message', { username: socket.username, message: data.message });
  });

  // Event listener for user disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

function updateGameState(data) {
  const { username, cardId } = data;

  // Find the player who clicked the card
  const player = gameState.players.find((p) => p.username === username);

  if (player) {
    // Find the card in the game state based on the cardId
    const card = gameState.gamecards.find((c) => c.cardid === parseInt(cardId, 10));

    if (card && card.location === 'deck') {
      // Move the card from the deck to the player's hand
      card.location = `${username}-hand`; // Adjust based on your naming convention for player hands

      // Log the updated state (for demonstration purposes)
      console.log('Updated Game State:', gameState);
    }
  }
}

// Function to update the database with the new game state
async function updateDatabaseGameState(data, db) {
  const { username, cardId } = data;

  // Update the database tables based on your game logic
  // For example, update the location of the card in the gamecards table
  const updateQuery = 'UPDATE gamecards SET location = $1 WHERE cardid = $2';
  const updatedLocation = `${username}-hand`; // Adjust based on your naming convention for player hands
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