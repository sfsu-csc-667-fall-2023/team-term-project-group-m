const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
  const name = "Josh";
  response.render("root", { name });
});

router.get("/register", (request, response) => {
  response.render("register");
});

router.get("/login", (request, response) => {
  response.render("login");
});

router.get("/lobby", (request, response) => {
  response.render("lobby");
});

module.exports = router;
