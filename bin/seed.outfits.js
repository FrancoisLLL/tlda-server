const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, "../.env")
});
require("../config/dbConnection");

const Item = require("../models/Item");
const User = require("../models/User");
const Outfit = require("../models/Outfit");
const {
    isNullOrUndefined
} = require("mongoose/lib/utils");
const Type = require("../models/Type")

async function seedOutfits() {
    try {
        await Outfit.collection
            .drop()
            .catch((error) => console.log("No collection to drop, proceeding..."));
        console.log("Item collection dropped");

        const usersInDB = await User.find().select("_id");

        const TypeTops = await Type.find({
            category: "top"
        }).select("_id")
        const TypeBottoms = await Type.find({
            category: "bottom"
        }).select("_id")
        const TypeShoes = await Type.find({
            category: "shoes"
        }).select("_id")

        // console.log("Tops: ", TypeTops,"Bottoms", TypeBottoms, "Shoes", TypeShoes)
        const usersItems = [];
        const outfits = [];

        for (let i = 0; i < usersInDB.length; i++) {
            // usersInDB[i].toObject();
            const temp = {
                user: usersInDB[i]._id
            };
            temp.topsInDB = await Item.find({
                user: usersInDB[i]._id,
                type: {
                    $in: TypeTops
                }
            }); // to be replace by a tops Id from DB
            temp.bottomsInDB = await Item.find({
                user: usersInDB[i]._id,
                type: {
                    $in: TypeBottoms
                }
            }); // to be replace by a tops Id from DB
            temp.shoesInDB = await Item.find({
                user: usersInDB[i]._id,
                type: {
                    $in: TypeShoes
                }
            }); // to be replace by a tops Id from DB
            usersItems.push(temp)
        }

        // console.log(usersItems)

        for (let i = 0; i < usersItems.length; i++) {

            for (let j = 0; j < 30; j++) {
                let outfit = {
                    user: null,
                    item: []
                };
                let date =new Date ()
                date = date.setDate(j)

                const randomTopIndex = Math.floor(Math.random() * usersItems[i].topsInDB.length);
                const randomBottomIndex = Math.floor(Math.random() * usersItems[i].bottomsInDB.length);
                const randomShoesIndex = Math.floor(Math.random() * usersItems[i].shoesInDB.length);

                outfit.user = usersItems[i].user;
                outfit.item.push(usersItems[i].topsInDB[randomTopIndex]);
                outfit.item.push(usersItems[i].bottomsInDB[randomBottomIndex]);
                outfit.item.push(usersItems[i].shoesInDB[randomShoesIndex]);
                outfit.date = date;
                outfits.push(outfit)
            }
        }

        console.log(outfits)

        const createdOutfits = await Outfit.create(outfits);
        console.log(createdOutfits);
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

seedOutfits();

module.exports = seedOutfits;