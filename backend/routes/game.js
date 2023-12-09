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
        console.log("Reached the end of /createGame in game.js");
    } catch (error) {
        console.error(error);
    } 
});


module.exports = router;