const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("../config/dbConnection");
const Color = require("../models/Color")

const colors = [
  {color: "#282a36"},
  {color: "#44475a"},
  {color: "#f8f8f2"},
  {color: "#6272a4"},
  {color: "#8be9fd"},
  {color: "#50fa7b"},
  {color: "#ffb86c"},
  {color: "#ff79c6"},
  {color: "#bd93f9"},
  {color: "#ff5555"},
  {color: "#f1fa8c"},
  {color: "#ffffff"},
  {color: "#000000"},
  {color: "#c2db9a"},
  {color: "#0800ff"},
  {color: "#d4d3c3"},
  {color: "#ead8ed"},
  {color: "#fc0303"},
  {color: "#6ab096"},  
  {color: "#ad6899"},
  {color: "#bfa4b7"},
  {color: "#5c807b"},//
  {color: "#f59898"},
  {color: "#9caf88"},
  {color: "#ffdd91"},
  {color: "#6582c0"},
  {color: "#d9e7e2"},
  {color: "#ff94f2"},
  {color: "#f8f8ff"},
  {color: "#afc065"},
  {color: "#e6c5ed"},
  {color: "#ff5000"},
  {color: "#678fcf"},
  {color: "#cf8d67"},
  {color: "#F08080"},
  {color: "#B03A2E"},
  {color: "#2E86C1"},
  {color: "#979A9A"},
  {color: "#154360"},
  {color: "#F7DC6F"},
  {color: "#7B241C"}
];

async function seedUsers() {
  try {
    await Color.collection
      .drop()
      .catch((error) => console.log("No collection to drop, proceeding..."));

    const createdColors = await Color.create(colors);
    console.log(createdColors);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
}

seedUsers();
