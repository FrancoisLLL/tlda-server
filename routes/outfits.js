const express = require("express");
const Outfit = require("../models/Outfit");
const requireAuth = require("../middlewares/requireAuth");
const validateId = require("../middlewares/validateId");
const fileUploader = require("../config/cloudinary.js");
const colorDiff = require('color-diff');


const {
    getUserItems,
    getMeteo,
    getRandomColorsHex,
    hexToRgbPaletteFormat,
    rgbToHex
} = require('../utils/utils');

const {
    colord
} = require("colord")
const router = express.Router();

router.get("/:id/details", requireAuth, validateId("id"), (req, res, next) => {
    Outfit.findById(req.params.id)
        .populate("item")
        .then((outfitDocument) => {
            if (!outfitDocument) {
                return res.status(404).json({
                    message: "No outfit was found"
                });
            } else {
                res.status(200).json(outfitDocument);
            }
        })
        .catch(next);
});

router.post("/", requireAuth, fileUploader.single("image"), (req, res, next) => {
    const updateValues = req.body;

    if (req.file) {
        updateValues.image = req.file.path;
    }

    updateValues.user = req.session.currentUser._id;

    Outfit.create(updateValues)
        .then((outfitDocument) => {
            outfitDocument
                .populate("user")
                .populate({
                    path: "item",
                    populate: {
                        path: "type"
                    }
                })
                .execPopulate()
                .then((outfit) => {
                    res.status(201).json(outfit); // send the populated document.
                })
                .catch(next);
        })
        .catch(next);
});


router.patch("/:id", requireAuth, validateId("id"), fileUploader.single("image"), (req, res, next) => {
    const outfit = {
        ...req.body
    };

    Outfit.findById(req.params.id)
        .then((outfitDocument) => {
            if (!outfitDocument)
                return res.status(404).json({
                    message: "Outfit not found"
                });
            if (outfitDocument.user.toString() !== req.session.currentUser._id) {
                return res
                    .status(403)
                    .json({
                        message: "You are not allowed to update this document"
                    });
            }

            if (req.file) {
                outfit.image = req.file.secure_url;
            }

            Outfit.findByIdAndUpdate(req.params.id, outfit, {
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

router.delete("/:id", requireAuth, validateId("id"), (req, res, next) => {


    Outfit.findById((req.params.id))
        .then((outfitDocument) => {
            if (!outfitDocument) {
                return res.status(404).json({
                    message: "Outfit not found"
                });
            }

            console.log(outfitDocument.user.toString(), req.session.currentUser._id)
            if (outfitDocument.user.toString() !== req.session.currentUser._id) {
                return res.status(403).json({
                    message: "You can't delete this outfit"
                });
            }

            Outfit.findByIdAndDelete(req.params.id)
                .then(() => {
                    return res.sendStatus(204);
                })
                .catch(next);
        })
        .catch(next);
});


//route that generates the random outfit based on meteo and on color
router.get("/generate", requireAuth, async (req, res, next) => {



    try {
        // const {
        //     season
        // } = await getMeteo();
        const season ="warm"
        // console.log(season)
    
        const tops = await  getUserItems(req.session.currentUser._id, "top", season); //We start by the top as base item for color random but could be anything
        // console.log(tops)

        const bottoms = await getUserItems(req.session.currentUser._id, "bottom", season);
        // console.log(bottoms)

        const shoes = await  getUserItems(req.session.currentUser._id, "shoes", season);

        // console.log(shoes)
        // let randomIndex = Math.floor(Math.random() * tops.length);
        // const top = tops[randomIndex];

        if (!tops.length || !bottoms.length || !shoes.length) {
            res.sendStatus(500)
            return;
        }
        // console.log(tops, bottoms, shoes)

        const randomIndex = Math.floor(Math.random() * tops.length);

        // console.log(randomIndex)

        const palette = await getRandomColorsHex([tops[randomIndex].color])

        console.log(palette)

        const top = await getRandomItemAndColor(tops, "top", palette)

        const bottom = await getRandomItemAndColor(bottoms, "bottom", palette)
        const shoe = await getRandomItemAndColor(shoes, "shoes", palette)

        const finalColorPalette = palette



        // const bottom = getRandomItemAndColor(bottoms, "bottom", await getRandomColorsHex([top.color]))
        // const shoe = getRandomItemAndColor(shoes, "shoes",await getRandomColorsHex([top.color, bottom.color]))
        // const finalColorPalette = await getRandomColorsHex([top.color, bottom.color, shoe.color])


        const result = {
            top,
            bottom,
            shoe,
            finalColorPalette
        }

        // console.log(result)

        res.status(200).json(result)

    } catch (error) {
        console.log(error)
        res.sendStatus(500).json(error)
    }

});


const getRandomItemAndColor = (items, category, paletteColors) => {

    let colorToSearch = ""

    if (category === "bottom") {
        colorToSearch = paletteColors[1];
    } else if (category === "shoes") {
        colorToSearch = paletteColors[2];
    } else {
        colorToSearch = paletteColors[0];
    }

    const itemsInPaletteColorsFormat = items.map(item => {
        return hexToRgbPaletteFormat(item.color)
    })

    const closestColorFoundRGB = colorDiff.closest(hexToRgbPaletteFormat(colorToSearch), itemsInPaletteColorsFormat)

    const closestColorFoundHex = rgbToHex(closestColorFoundRGB.R, closestColorFoundRGB.G, closestColorFoundRGB.B);
    // console.log("closest", closestColorFoundHex, "toSearch", colorToSearch)

    // console.log(items.map(item => {
    //     return (item.color)
    // }))

    const filteredItems = items.filter((item) => item.color.toLowerCase() === closestColorFoundHex.toLowerCase() )

    const randomIndex = Math.floor(Math.random() * filteredItems.length);
    const item = filteredItems[randomIndex];

    // console.log("item :", category, "color palette: ", paletteColors, "closest color: ", closestColorFoundHex)

    // console.log(item)

    return item

}

module.exports = router;