const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
  const name = "Josh";
  response.render("root", { name });
});

module.exports = router;
