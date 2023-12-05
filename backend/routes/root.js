const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
  response.render("root", {user: request.session.user});
});

router.get("/register", (request, response) => {
  response.render("register", {user: request.session.user});
});

router.get("/login", (request, response) => {
  response.render("login", {user: request.session.user});
});

router.get("/lobby", (request, response) => {
  response.render("lobby", {user: request.session.user});
});

router.get("/logout", (request, response) => {
  request.session.destroy((err) => {
    if (err) {
        console.error("Session destruction error:", err);
        response.status(500).send("An error occurred while logging out.");
    } else {
        response.redirect("/");
    }
  });
});

module.exports = router;
