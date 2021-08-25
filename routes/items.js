const express = require("express");
const Item = require("../models/Item");

const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();
const fileUploader = require("../config/cloudinary.js");

const validateId = require("../middlewares/validateId");
const {
  update
} = require("../models/Item");

// (R) Read all Items
// Responses:
// 200 : The list of items
// 500 : error
router.get("/", requireAuth, (req, res, next) => {
  Item.find()
    .populate("user")
    .populate("type")
    .then((itemDocuments) => {
      res.status(200).json(itemDocuments);
    })
    .catch(next);
});


// (C) Create an Item
// Requires the user to be authenticated
// Responses:
// 201 : Responds with the created document
// 500 : error
router.post("/", requireAuth, fileUploader.single("image"), (req, res, next) => {
  const updateValues = req.body;


  if (req.file) {
    updateValues.image = req.file.path;
  }

  updateValues.user = req.session.currentUser._id;

  Item.create(updateValues)
    .then((itemDocument) => {
      itemDocument
        .populate("user")
        .populate("type")
        .execPopulate()
        .then((item) => {
          res.status(201).json(item); // send the populated document.
        })
        .catch(next);
    })
    .catch(next);
});

// (C) Create multipleItems
// Requires the user to be authenticated
// Responses:
// 201 : Responds with the created document
// 500 : error
router.post("/batchInsert", requireAuth, (req, res, next) => {
    const updateValues = req.body.map(item => {
      item.user = req.session.currentUser._id
      return item
    })

    console.log("update", updateValues)

    Item.create(updateValues)
      .then((itemDocument) => {
        res.status(201).json(itemDocument); // send the populated document.
      })
      .catch(next);

});

// (R) Read one Item
// Responses:
// 400 : Incorrect mongoose id
// 404 : No item found
// 200 : Responds with the updated document
// 500 : error
router.get("/:itemId", requireAuth, validateId("itemId"), (req, res, next) => {
  Item.findById(req.params.itemId)
    .populate("user")
    .populate("type")
    .then((itemDocument) => {
      if (!itemDocument) {
        return res.status(404).json({
          message: "No item was found"
        });
      } else {
        res.status(200).json(itemDocument);
      }
    })
    .catch(next);
});


// (U) Update an Item
// Requires the user to be authenticated
// Responses:
// 400 : Incorrect mongoose id
// 404 : No item found
// 403 : User id doesn't match the session user id
// 200 : Responds with the updated document
// 500 : error
router.patch("/:id", requireAuth, validateId("id"), fileUploader.single("image"), (req, res, next) => {
  const item = {
    ...req.body
  };

  Item.findById(req.params.id)
    .then((itemDocument) => {
      if (!itemDocument)
        return res.status(404).json({
          message: "Item not found"
        });
      if (itemDocument.user.toString() !== req.session.currentUser._id) {
        return res
          .status(403)
          .json({
            message: "You are not allowed to update this document"
          });
      }

      if (req.file) {
        item.image = req.file.secure_url;
      }

      Item.findByIdAndUpdate(req.params.id, item, {
          new: true
        })
        .populate("user")
        .then((updatedDocument) => {
          return res.status(200).json(updatedDocument);
        })
        .catch(next);
    })
    .catch(next);
});

// (D) Delete an Item
// Requires the user to be authenticated
// Responses:
// 400 : Incorrect mongoose id
// 404 : No item found
// 403 : User id doesn't match the session user id
// 204 : Successful
// 500 : error

router.delete("/:id", requireAuth, validateId("id"), (req, res, next) => {

  Item.findById((req.params.id))
    .then((itemDocument) => {
      if (!itemDocument) {
        return res.status(404).json({
          message: "Item not found"
        });
      }


      console.log(itemDocument.user.toString(), req.session.currentUser._id)
      if (itemDocument.user.toString() !== req.session.currentUser._id) {
        return res.status(403).json({
          message: "You can't delete this item"
        });
      }

      Item.findByIdAndDelete(req.params.id)
        .then(() => {
          return res.sendStatus(204);
        })
        .catch(next);
    })
    .catch(next);
});


module.exports = router;