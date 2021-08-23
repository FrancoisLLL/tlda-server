const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const typeSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://res.cloudinary.com/francoiscloudinary/image/upload/v1629383063/tlda/NqICKyx-tshirt-vector_rxxduc.svg"
    },
    season: [{
        type: String,
        enum: ["warm", "cold"],
        required: true
    }],
    ecoCost: {
        type: Number,
        default: 1000
    },
    category: {
        type: String,
        enum: ["top", "bottom", "shoes"]
    }
}, {
    timestamps: true
});

const Type = mongoose.model("Type", typeSchema);

module.exports = Type;