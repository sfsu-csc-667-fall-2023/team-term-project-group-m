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

        // Create a new deck of cards
        const query2 = `INSERT INTO gamecards (gameid, cardid, location)
        SELECT $1, 1, 'deck'
        UNION ALL SELECT $1, 1, 'deck'
        UNION ALL SELECT $1, 1, 'deck'
        UNION ALL SELECT $1, 2, 'deck'
        UNION ALL SELECT $1, 2, 'deck'
        UNION ALL SELECT $1, 3, 'deck'
        UNION ALL SELECT $1, 3, 'deck'
        UNION ALL SELECT $1, 4, 'deck'
        UNION ALL SELECT $1, 4, 'deck'
        UNION ALL SELECT $1, 5, 'deck'
        UNION ALL SELECT $1, 5, 'deck'
        UNION ALL SELECT $1, 6, 'deck'
        UNION ALL SELECT $1, 6, 'deck'
        UNION ALL SELECT $1, 7, 'deck'
        UNION ALL SELECT $1, 7, 'deck'
        UNION ALL SELECT $1, 8, 'deck'
        UNION ALL SELECT $1, 8, 'deck'
        UNION ALL SELECT $1, 9, 'deck'
        UNION ALL SELECT $1, 9, 'deck'
        UNION ALL SELECT $1, 10, 'deck'
        UNION ALL SELECT $1, 11, 'deck'
        UNION ALL SELECT $1, 11, 'deck'
        UNION ALL SELECT $1, 12, 'deck'
        UNION ALL SELECT $1, 12, 'deck'
        UNION ALL SELECT $1, 13, 'deck'
        UNION ALL SELECT $1, 13, 'deck'
        UNION ALL SELECT $1, 14, 'deck'
        UNION ALL SELECT $1, 14, 'deck'
        UNION ALL SELECT $1, 15, 'deck'
        UNION ALL SELECT $1, 15, 'deck'
        UNION ALL SELECT $1, 16, 'deck'
        UNION ALL SELECT $1, 16, 'deck'
        UNION ALL SELECT $1, 17, 'deck'
        UNION ALL SELECT $1, 17, 'deck'
        UNION ALL SELECT $1, 18, 'deck'
        UNION ALL SELECT $1, 18, 'deck'
        UNION ALL SELECT $1, 19, 'deck'
        UNION ALL SELECT $1, 19, 'deck'
        UNION ALL SELECT $1, 20, 'deck'
        UNION ALL SELECT $1, 20, 'deck'
        UNION ALL SELECT $1, 21, 'deck'
        UNION ALL SELECT $1, 21, 'deck'
        UNION ALL SELECT $1, 22, 'deck'
        UNION ALL SELECT $1, 22, 'deck'
        UNION ALL SELECT $1, 23, 'deck'
        UNION ALL SELECT $1, 24, 'deck'
        UNION ALL SELECT $1, 24, 'deck'
        UNION ALL SELECT $1, 25, 'deck'
        UNION ALL SELECT $1, 25, 'deck'
        UNION ALL SELECT $1, 26, 'deck'
        UNION ALL SELECT $1, 26, 'deck'
        UNION ALL SELECT $1, 27, 'deck'
        UNION ALL SELECT $1, 27, 'deck'
        UNION ALL SELECT $1, 28, 'deck'
        UNION ALL SELECT $1, 28, 'deck'
        UNION ALL SELECT $1, 29, 'deck'
        UNION ALL SELECT $1, 29, 'deck'
        UNION ALL SELECT $1, 30, 'deck'
        UNION ALL SELECT $1, 30, 'deck'
        UNION ALL SELECT $1, 31, 'deck'
        UNION ALL SELECT $1, 31, 'deck'
        UNION ALL SELECT $1, 32, 'deck'
        UNION ALL SELECT $1, 32, 'deck'
        UNION ALL SELECT $1, 33, 'deck'
        UNION ALL SELECT $1, 33, 'deck'
        UNION ALL SELECT $1, 34, 'deck'
        UNION ALL SELECT $1, 34, 'deck'
        UNION ALL SELECT $1, 35, 'deck'
        UNION ALL SELECT $1, 35, 'deck'
        UNION ALL SELECT $1, 36, 'deck'
        UNION ALL SELECT $1, 37, 'deck'
        UNION ALL SELECT $1, 37, 'deck'
        UNION ALL SELECT $1, 38, 'deck'
        UNION ALL SELECT $1, 38, 'deck'
        UNION ALL SELECT $1, 39, 'deck'
        UNION ALL SELECT $1, 39, 'deck'
        UNION ALL SELECT $1, 40, 'deck'
        UNION ALL SELECT $1, 40, 'deck'
        UNION ALL SELECT $1, 41, 'deck'
        UNION ALL SELECT $1, 41, 'deck'
        UNION ALL SELECT $1, 42, 'deck'
        UNION ALL SELECT $1, 42, 'deck'
        UNION ALL SELECT $1, 43, 'deck'
        UNION ALL SELECT $1, 43, 'deck'
        UNION ALL SELECT $1, 44, 'deck'
        UNION ALL SELECT $1, 44, 'deck'
        UNION ALL SELECT $1, 45, 'deck'
        UNION ALL SELECT $1, 45, 'deck'
        UNION ALL SELECT $1, 46, 'deck'
        UNION ALL SELECT $1, 46, 'deck'
        UNION ALL SELECT $1, 47, 'deck'
        UNION ALL SELECT $1, 47, 'deck'
        UNION ALL SELECT $1, 48, 'deck'
        UNION ALL SELECT $1, 48, 'deck'
        UNION ALL SELECT $1, 49, 'deck'
        UNION ALL SELECT $1, 50, 'deck'
        UNION ALL SELECT $1, 50, 'deck'
        UNION ALL SELECT $1, 51, 'deck'
        UNION ALL SELECT $1, 51, 'deck'
        UNION ALL SELECT $1, 52, 'deck'
        UNION ALL SELECT $1, 52, 'deck'
        UNION ALL SELECT $1, 53, 'deck'
        UNION ALL SELECT $1, 53, 'deck'
        UNION ALL SELECT $1, 53, 'deck'
        UNION ALL SELECT $1, 53, 'deck'
        UNION ALL SELECT $1, 54, 'deck'
        UNION ALL SELECT $1, 54, 'deck'
        UNION ALL SELECT $1, 54, 'deck'
        UNION ALL SELECT $1, 54, 'deck' RETURNING *`;
        const gamecards = await db.any(query2, gameCreated.gameid);
        console.log("108 cards created for the new game");

        // Auto shuffle and deal for the first player's hand
        var randomInteger;
        for(i = 0; i++; i < 7){
            randomInteger = Math.floor(Math.random() * (108)) + 1;
            
        }

        // Redirect the user to the new game page
        response.redirect(`/game/${gameCreated.gameid}`);
        
    } catch (error) {
        console.error(error);
        // Handle error and send an appropriate response
        response.status(500).send("Error creating a game");
    } 
});

router.post("/joinGame", async (request, response)=>{
    const gameId = request.body.gameId;
    const userId = request.session.user.userid;
    console.log("Joining game " + gameId + " with user " + userId + ".");

    try{
        const query = 'INSERT INTO playerlist(gameid, userid) VALUES($1, $2) RETURNING *';
        const values = [gameId, userId];
        const currentPlayerList = await db.any(query, values);
        console.log("Current player list is: " + currentPlayerList[0]);

        //Render game.ejs with user and game info
        response.redirect(`game/${gameId}`);
    }
    catch(error){
        console.error(error);
        response.redirect("/lobby");
    }
});

router.get("/game/:gameId", async(request, response)=>{
    const gameId = request.params.gameId;

    // Get all players in the current game
    const query = 'SELECT playerlist.userid, users.username FROM playerList INNER JOIN users ON playerlist.userid = users.userid WHERE gameid = $1;';
    const values = gameId;
    var players = await db.any(query, values);

    // Get all cards of the players in the current game
    const query2 = 'SELECT * FROM gamecards WHERE gameid = $1;';
    const values2 = gameId;
    var gamecards = await db.any(query2, values2);

    response.render("game", {user: request.session.user, gameId: gameId, players: players, gamecards: gamecards});
})

module.exports = router;