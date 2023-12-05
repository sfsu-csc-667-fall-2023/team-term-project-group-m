const express = require('express');
const router = express.Router();

router.get("/login", (request, response) => {
    var email = request.email;
    var password = request.password;
    console.log("email is: " + email + ", and password is: " + password);

    // Send a query to the Postgre database

    // Render lobby after logging in
    response.redirect("/lobby");
})

module.exports = router;