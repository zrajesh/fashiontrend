// Imports
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
// Models Imports
const User = require("../models/user");

// Controllers
exports.signup = (req, res) => {
    // Validation
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    const user = new User(req.body);
    user.save((err, user) => {
        if(err) {
            return res.status(400).json({
                message: "not able to save user in DB"
            });
        }
        res.status(200).json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    });
}

exports.signin = (req, res) => {
    // Extracting email and password from front-end request
    const {email, password} = req.body;
    // Validation
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    // Searching a user
    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                err: "user email does not exist"
            });
        }
        if(!user.authenticate(password)) {
            return res.status(400).json({
                err: "email and password do not match"
            });
        }
        // Create token based on user id
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        // put token into cookie
        res.cookie("token", token, {expire: new Date() + 999});
        // send response to front-end
        const {_id, name, email, role} = user;
        return res.json({token, user: {_id, name, email, role}});
    });
}

exports.signout = (req, res) => {
    // Clearing cookie
    res.clearCookie("token");
    res.json({
        message: "user signout success"
    });
}

// Protected routes
// checking for token
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET, 
    algorithms: ['HS256'],
    userProperty: "auth"
});
// Custom Middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker) {
        return res.status(403).json({
            error: "Access denied"
        });
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0) {
        return res.status(403).json({
            error: "you are not an admin"
        });
    }
    next();
}
