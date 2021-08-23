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
        category: "bottom",
        image: "https://res.cloudinary.com/francoiscloudinary/image/upload/v1629720970/tlda/icons/039-jeans_h6uwww.svg"
    },
    {
        type: "T-shirt",
        season: ["warm"],
        ecoCost: 1000,
        category: "top",
        image: "https://res.cloudinary.com/francoiscloudinary/image/upload/v1629720958/tlda/icons/001-t_shirt_r7qss4.svg"
    },
    {
        type: "Shirt",
        season: ["warm", "cold"],
        ecoCost: 3000,
        category: "top",
        image: "https://res.cloudinary.com/francoiscloudinary/image/upload/v1629720983/tlda/icons/077-shirt_ohtoyd.svg"
    },
    {
        type: "Polo",
        season: ["warm"],
        ecoCost: 2000,
        category: "top",
        image: "https://res.cloudinary.com/francoiscloudinary/image/upload/v1629720980/tlda/icons/068-polo_shirt_krwcyf.svg"
    },
    {
        type: "Shorts",
        season: ["warm"],
        ecoCost: 3000,
        category: "bottom",
        image:"https://res.cloudinary.com/francoiscloudinary/image/upload/v1629720978/tlda/icons/062-swim_shorts_w7cr0j.svg"
    },
    {
        type: "Hoodie",
        season: ["cold"],
        ecoCost: 4000,
        category: "top",
        image:"https://res.cloudinary.com/francoiscloudinary/image/upload/v1629720970/tlda/icons/041-hoodie_bk4k67.svg"
    },
    {
        type: "Trousers",
        season: ["warm", "cold"],
        ecoCost: 5000,
        category: "bottom",
        image: "https://res.cloudinary.com/francoiscloudinary/image/upload/v1629720972/tlda/icons/044-jeans_qz6dlh.svg"
    },
    {
        type: "Sneakers",
        season: ["warm", "cold"],
        ecoCost: 15000,
        category: "shoes",
        image:"https://res.cloudinary.com/francoiscloudinary/image/upload/v1629720966/tlda/icons/029-trainer_pzskk6.svg"
    },
    {
        type: "Shoes",
        season: ["warm", "cold"],
        ecoCost: 20000,
        category: "shoes",
        image : 'https://res.cloudinary.com/francoiscloudinary/image/upload/v1629720989/tlda/icons/095-smart_shoe_wdflrg.svg'
    },
    {
        type: "Jumpers",
        season: ["cold"],
        ecoCost: 7000,
        category: "top",
        image: "https://res.cloudinary.com/francoiscloudinary/image/upload/v1629720984/tlda/icons/080-jumper_ba18uo.svg"
    },
    {
        type: "Leggings",
        season: ["cold", "warm"],
        ecoCost: 5000,
        category: "bottom",
        image: "https://res.cloudinary.com/francoiscloudinary/image/upload/v1629720962/tlda/icons/018-shorts_exgbx8.svg"
    },
    {
        type: "Skirt",
        season: ["warm"],
        ecoCost: 7000,
        category: "bottom",
        image: "https://res.cloudinary.com/francoiscloudinary/image/upload/v1629720966/tlda/icons/027-skirt_g6y00d.svg"
    },
    {
        type: "Cardigan",
        season: ["warm"],
        ecoCost: 7000,
        category: "top",
        image: "https://res.cloudinary.com/francoiscloudinary/image/upload/v1629720974/tlda/icons/050-cardigan_oetqwf.svg"
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