const express = require("express");
const Type = require("../models/Type");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();

router.get("/", requireAuth, (req, res, next) => {
  Type.find()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(next);
});

module.exports = router;
