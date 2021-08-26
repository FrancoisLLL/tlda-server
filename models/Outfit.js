const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const outfitSchema = new Schema({
    item: [{
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: String,
    date: {type: Date, default: Date.now}
}, {
    timestamps: true
});

const Outfit = mongoose.model("Outfit", outfitSchema);

module.exports = Outfit;