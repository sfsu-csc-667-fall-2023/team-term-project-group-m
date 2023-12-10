const express = require('express');
const router = express.Router();
const db = require("../db/connection.js");
const bcrypt = require('bcrypt');
const socket = require('./middleware/socket.js');

router.post("/login", async (request, response) => {
    var email = request.body.email;
    var password = request.body.password;

    // Send a query to the PostgreSQL database
    try{
        const query = 'SELECT * FROM users WHERE email = $1';
        const values = [email];
        const user = await db.oneOrNone(query, values);
        if(user === null){
            console.log("User not found.");
            response.redirect("/login");
        }
        else {
            console.log("User data retrieved is: " + user.email + ", " + user.username + ", " + user.password);
            const validated = await bcrypt.compare(password, user.password);
            if(validated == true){
                console.log("User login successful.");
                request.session.user = user;
                console.log("request.session.user.username is: " + request.session.user.username)
                socket.emit('get_user', request.session.user );
                response.redirect("/lobby");
            }
            else{
                console.log("Invalid user credentials!");
                response.redirect("/login");
            }
        }
    }
    catch(error){
        console.error(error);
        response.redirect("/login");
    }
})

module.exports = router;