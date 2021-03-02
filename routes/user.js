const express = require("express");
const router = express.Router();
// Controller Imports
const {
    getUSerById,
    getUser, 
    updateUser, 
    userPruchaseList
  } = require("../controllers/user");
const {
    isSignedIn, 
    isAuthenticated, 
    isAdmin
    } = require("../controllers/auth");

// Params
router.param("userId", getUSerById);
// Routes
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);
router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPruchaseList);

module.exports = router;