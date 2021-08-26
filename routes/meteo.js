const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();

const {
    getMeteo,

} = require('../utils/utils');


router.get("/", requireAuth, async (req, res, next) => {

    try {
        // const {
        //     season
        // } = await getMeteo();
        const season = "warm"
        //sending something cause I reached
        res.status(200).json(season);

    } catch (error) {
        // console.log(error)
        res.sendStatus(500)

        //sending something cause I reached
        // res.status(200).json({
        //     "season": "warm"
        // });

    }

});

module.exports = router;