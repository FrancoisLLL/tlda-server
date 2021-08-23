const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("../config/dbConnection");
const bcrypt = require("bcrypt");

const User = require("../models/User");

const salt = 10;

const users = [
  {
    firstName: "Francois",
    lastName: "Ly",
    email: "francoisly@ymail.com",
    password: bcrypt.hashSync("1234", salt),
  },
  {
    firstName: "Cabriole",
    lastName: "The Cat",
    email: "gabi@gmail.com",
    password: bcrypt.hashSync("1234", salt),
  },
];

async function seedUsers() {
  try {
    await User.collection
      .drop()
      .catch((error) => console.log("No collection to drop, proceeding..."));

    const createdUsers = await User.create(users);
    console.log(createdUsers);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
}

seedUsers();
