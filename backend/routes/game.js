const express = require("express");
const router = express.Router();
const db = require("../db/connection.js");
const socket = require('../middleware/socket');


function shuffleDeck() {
    const deck = unoGame.deck;
    let currentIndex = deck.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
    }
}


router.post("/createGame", async (request, response)=>{
    console.log("Attempting to create a game...");
    try{
        unoGame.deck = initializeUnoDeck();
        shuffleDeck();

        // Add the first card to the discard pile
        unoGame.discardPile.push(unoGame.deck.pop());

        const query = 'INSERT INTO games(status) VALUES($1) RETURNING *';
        const gameCreated = await db.one(query, ['Waiting']);
        console.log("Data from created game is: " + gameCreated);

        unoGame.status = 'Waiting';
        unoGame.players = [];
        unoGame.currentTurn = 0;

        const io = socket.getIO();
        io.emit('new-game', gameCreated);
        response.redirect(`/game/${gameCreated.gameid}`);
    } catch (error) {
        console.error(error);
        console.log("Reached the end of /createGame in game.js");
    } 
});
router.get("/:gameid", (request, response) => {
    const gameId = request.params.gameid;
    // You can render your game page (e.g., game.ejs) and pass the gameId to it
    response.render('game', { gameId });
});

function initializeUnoDeck() {
    const colors = ['red', 'green', 'blue', 'yellow'];
    const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'draw2'];

    const deck = [];

    for (const color of colors) {
        for (const value of values) {
            deck.push({ color, value });
        }
    }

    return deck;
}

module.exports = router;