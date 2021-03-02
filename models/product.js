// Imports
const mongoose = require("mongoose");
const {Schema} = mongoose;
const {ObjectId} = Schema;

const productSchema = new Schema({
    name: {
        type: String,
        maxlength: 32,
        required: true,
        trim: true
    },
    description: {
        type: String,
        maxlength: 1200,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        maxlength: 32,
        required: true,
        trim: true
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: true
    },
    stock: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    size: {
        type: String,
        required: true
    }
},
{timestamps: true});

module.exports = mongoose.model("Product", productSchema);
  