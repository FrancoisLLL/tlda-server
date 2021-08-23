const express = require("express");
const Color = require("../models/Color");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();

router.get("/", requireAuth, (req, res, next) => {
  Color.find().select("color -_id")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(next);
});

module.exports = router;
