// Imports
const mongoose = require("mongoose");
const {Schema} = mongoose;
const crypto = require('crypto');
const {v4: uuidv4} = require("uuid");
uuidv4();
// User Schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 40,
        trim: true
    },
    lastname: {
        type: String,
        maxlength: 40,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    userInfo: {
        type: String,
        trim: true
    },
    encry_password: {
        type: String,
        required: true
    },
    // creates unique salt(random characters) per user
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
},
{timestamps: true});
// Virtual field for password
userSchema.virtual("password")
    .set(function(password) {
        this._password = password;
        this.salt = uuidv4();
        this.encry_password = this.securePassword(password);
    })
    .get(function() {
        return this._password;
    })

userSchema.methods = {
    authenticate: function(plainPassword) {
        return this.securePassword(plainPassword) === this.encry_password;
    },    
    // putting unique salt + plain password into Hash function
    securePassword: function(plainPassword) {
        if(!plainPassword) return "";
        try {
            return crypto.createHmac('sha256', this.salt)
                .update(plainPassword)
                .digest('hex');
        } catch (err) {
            return "";
        }
    }
}

module.exports = mongoose.model("User", userSchema);
