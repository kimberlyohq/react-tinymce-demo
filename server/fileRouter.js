const express = require("express");

const router = express.Router();
let count = 0
router.post("/upload", (req, res) => {
  console.log(new Date());
  console.log(count);
  count++;
  res.status(200).send({
    
    id: Date.now(),
  });
});

router.get('/:id', (req, res) => {
  res.sendFile('doge.jpeg', { root: process.cwd() })
})

module.exports = router;
