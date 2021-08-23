const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    description: String,
    type: {
        type: Schema.Types.ObjectId,
        ref: 'Type',
        required: true
    },
    color: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String
    },
}, {
    timestamps: true
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;