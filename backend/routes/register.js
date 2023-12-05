const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require("../db/connection.js");


router.post("/register", async (request, response) => {
    var email = request.body.email;
    var username = request.body.username;
    var password = request.body.password;
    var confirmPassword = request.body.confirmPassword; 

    if(password != confirmPassword){
        console.log("Passwords do not match!");
        response.redirect("/register");
    }
    else{
        try{
        // Encrypt password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Send a query to the PostgreSQL DB
        const query = 'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *';
        const values = [username, email, hashedPassword];
        const user = await db.any(query, values);
        console.log("User data entered is: " + user[0]);

        //Render login page after registering
        response.redirect("/login");
        } catch(error){
            console.log(error);
            response.redirect('/register')
        }
    }
})


module.exports = router;