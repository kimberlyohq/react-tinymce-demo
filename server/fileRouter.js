const express = require("express");

const router = express.Router();

router.post("/upload", (req, res) => {
  console.log(req.bdoy);
  res.status(200).send({
    location:
      "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
  });
});

module.exports = router; 
