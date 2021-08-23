const express = require("express");
const User = require("../models/User");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();
const Item = require('../models/Item.js')
const Outfit = require('../models/Outfit.js')

const upload = require("../config/cloudinary.js");


router.get("/me", requireAuth, (req, res, next) => {
  User.findById(req.session.currentUser._id)
    .select("-password")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(next);
});

router.patch("/me", requireAuth, upload.single("profileImg"),
  (req, res, next) => {
    const userId = req.session.currentUser;

    if (req.file) {
      req.body.profileImg = req.file.path;
    }
    User.findByIdAndUpdate(userId, req.body, {
        new: true
      })
      .select("-password") // Remove the password field from the found document.
      .then((userDocument) => {
        res.status(200).json(userDocument);
      })
      .catch(next);
  }
);

router.get("/me/items", requireAuth, (req, res, next) => {
  const currentUserId = req.session.currentUser._id; // We retrieve the users id from the session.

  // And then get all the items matching the user field that matches the logged in users id.
  Item.find({
      user: currentUserId
    })
    .then((itemDocuments) => {
      res.status(200).json(itemDocuments);
    })
    .catch(next);
});

router.get("/me/outfits", requireAuth, (req, res, next) => {
  const currentUserId = req.session.currentUser._id; // We retrieve the users id from the session.

  // And then get all the items matching the user field that matches the logged in users id.
  Outfit.find({
      user: currentUserId
    })
    .sort({"date": -1})
    .populate({
      path: "item",
      populate: {
        path: "type"
      }
    })
    .then((itemDocuments) => {
      res.status(200).json(itemDocuments);
    })
    .catch(next);
});

module.exports = router;