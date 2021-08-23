const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, "../.env")
});
require("../config/dbConnection");

const Type = require("../models/Type");


const types = [{
        type: "Jeans",
        season: ["warm", "cold"],
        ecoCost: 9000,
        category: "bottom"
    },
    {
        type: "T-shirt",
        season: ["warm"],
        ecoCost: 1000,
        category: "top"
    },
    {
        type: "Shirt",
        season: ["warm", "cold"],
        ecoCost: 3000,
        category: "top"
    },
    {
        type: "Polo",
        season: ["warm"],
        ecoCost: 2000,
        category: "top"
    },
    {
        type: "Shorts",
        season: ["warm"],
        ecoCost: 3000,
        category: "bottom"
    },
    {
        type: "Hoodie",
        season: ["cold"],
        ecoCost: 4000,
        category: "top"
    },
    {
        type: "Trousers",
        season: ["warm", "cold"],
        ecoCost: 5000,
        category: "bottom"
    },
    {
        type: "Sneakers",
        season: ["warm", "cold"],
        ecoCost: 15000,
        category: "shoes"
    },
    {
        type: "Shoes",
        season: ["warm", "cold"],
        ecoCost: 20000,
        category: "shoes"
    },
    {
        type: "Jumpers",
        season: ["cold"],
        ecoCost: 7000,
        category: "top"
    },
    {
        type: "Leggings",
        season: ["cold", "warm"],
        ecoCost: 5000,
        category: "bottom"
    },
    {
        type: "Skirt",
        season: ["warm"],
        ecoCost: 7000,
        category: "bottom"
    },
];

async function seedTypes() {
    try {
        await Type.collection
            .drop()
            .catch((error) => console.log("No collection to drop, proceeding..."));
        const createdTypes = await Type.create(types);
        console.log(createdTypes);
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

seedTypes();