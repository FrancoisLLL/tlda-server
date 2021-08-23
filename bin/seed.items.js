const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, "../.env")
});
require("../config/dbConnection");

const Item = require("../models/Item");
const User = require("../models/User");
const Type = require("../models/Type");
const Color = require("../models/Color");

async function seedItems() {
    try {
        await Item.collection
            .drop()
            .catch((error) => console.log("No collection to drop, proceeding..."));
        console.log("Item collection dropped");

        const usersInDB = await User.find();
        const typesInDB = await Type.find();
        const colorsInDB = await Color.find();

        const items = [];

        for (let i = 0; i < 200; i++) {
            let item = {};
            const randomUserIndex = Math.floor(Math.random() * usersInDB.length);
            const randomTypeIndex = Math.floor(Math.random() * typesInDB.length);
            const randomColorIndex = Math.floor(Math.random() * colorsInDB.length);

            item.user = usersInDB[randomUserIndex]._id;
            item.type = typesInDB[randomTypeIndex]._id;
            item.color = colorsInDB[randomColorIndex].color;
            items.push(item)
        }


        const createdItems = await Item.create(items);
        console.log(createdItems);
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

seedItems();

module.exports = seedItems;