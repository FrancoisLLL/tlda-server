const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colorSchema = new Schema({
  color: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

const Color = mongoose.model("Color", colorSchema);

module.exports = Color;