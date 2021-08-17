const express = require("express");

const router = express.Router();

router.post("/upload", (req, res) => {
  console.log(new Date());
  res.status(200).send({
    location:
      "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
    id: "7594c290c2b6a7294b543530c1c9aa12",
  });
});

module.exports = router;
