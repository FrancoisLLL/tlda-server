const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, "../.env")
});
require("../config/dbConnection");


const Item = require("../models/Item");
const User = require("../models/User");
const Type = require("../models/Type");
const Color = require("../models/Color");
const axios = require("axios")
const colorDiff = require('color-diff');


const getType = async (category, season) => {

    const types = await Type.find({
        category: category,
        season: season
    }).select("_id");
    return types;
}

const getColor = async () => {
    const colors = await Color.find();
    return colors;
}

const getUserItems = async (user, category, season) => {

    if (!user) {
        console.log("err in getUserItems")
        return 0
    }

    const filter = {
        user: user
    }

    if (category || season) {
        filter.type = {
            "$in": await getType(category, season)
        }
    }

    const items = await Item.find(filter).populate("type", "type season");

    return items;
}


////////////////////Color related utils
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

function hexToRgbPaletteFormat(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        R: parseInt(result[1], 16),
        G: parseInt(result[2], 16),
        B: parseInt(result[3], 16)
    }: null;
}

// function RgbPaletteFormatToHex(RGBPal) {
//     var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//     return result ? {
//         R: parseInt(result[1], 16),
//         G: parseInt(result[2], 16),
//         B: parseInt(result[3], 16)
//     }: null;
// }



//for meteo : sample API call 
// https://api.openweathermap.org/data/2.5/onecall?lat=48.8534&lon=2.3488&appid=bbf5fdc21890cd10763c2d9d386ff8e0&units=metric&lang=fr

const getMeteo = async () => {

    const res = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=48.8534&lon=2.3488&appid=${process.env.OPENWEATHERMAP_KEY}&units=metric&lang=fr&exclude=minutely,hourly`)

    const meteo = 
    {
        season : res.data.daily[0].feels_like.day > 18 ? "warm": "cold",
        weather : res.data.daily[0].weather[0].main
    }

    return meteo;
}
const getRandomColorsHex = async (arrayOfHexColors) => {

    const colors = arrayOfHexColors ? arrayOfHexColors.map((color) => {
        return hexToRgb(color);
    }) : [];

    const colorsLength = colors.length;

    for (let i = 0; i < 5-colorsLength; i++) {
        colors.push("N")
    }

    const colorsRes = await axios.post("http://colormind.io/api/", {
        "input": colors,
        "model": "default"
    })

    const colorResRGB = colorsRes.data.result.map(item => rgbToHex(item[0], item[1], item[2]))

    return colorResRGB;
}


module.exports = {
    getRandomColorsHex,
    getUserItems,
    getMeteo,
    hexToRgbPaletteFormat,
    rgbToHex
};