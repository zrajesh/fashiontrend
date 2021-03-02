// Imports
const mongoose = require("mongoose");
const {Schema} = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        maxlength: 32,
        required: true,
        trim: true,
        unique: true
    }
}, 
{timestamps: true});

module.exports = mongoose.model("Category", categorySchema);
