const express = require("express");

const router = express.Router();

router.post("/upload", (req, res) => {
  res.status(200).send({
    id: Date.now(),
  });
});

router.get("/:id", (req, res) => {
  res.sendFile("doge.jpeg", { root: process.cwd() });
});

module.exports = router;
