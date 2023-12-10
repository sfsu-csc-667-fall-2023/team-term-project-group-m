const express = require("express");
const router = express.Router();
const db = require("../db/connection.js");
const socket = require('../middleware/socket');

router.post("/createGame", async (request, response)=>{
    console.log("Attempting to create a game...");
    try{
        const query = 'INSERT INTO games(status) VALUES($1) RETURNING *';
        const gameCreated = await db.one(query, ['Waiting']);
        console.log("Data from created game is: " + gameCreated);

        const io = socket.getIO();
        io.emit('new-game', gameCreated);

        // Redirect the user to the new game page
        response.redirect(`/game/${gameCreated.gameid}`);
        
    } catch (error) {
        console.error(error);
        // Handle error and send an appropriate response
        response.status(500).send("Error creating a game");
    } 
});



module.exports = router;