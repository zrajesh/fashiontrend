const express = require("express");
const router = express.Router();
// custom Imports
const {
    getCategoryById,
    createCategory,
    getCategory,
    getAllCategory,
    updateCategory,
    deleteCategory
    } = require("../controllers/category"); 
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
// Routes
router.param("userId", getUSerById);
router.param("categoryId", getCategoryById);
// Routes
// Create
router.post(
    "/category/create/:userId", 
    isSignedIn, 
    isAuthenticated, 
    isAdmin, 
    createCategory
);
// Read
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);
// Update
router.put(
    "/category/:categoryId/:userId", 
    isSignedIn, 
    isAuthenticated, 
    isAdmin, 
    updateCategory
);
// Delete
router.delete(
    "/category/:categoryId/:userId", 
    isSignedIn, 
    isAuthenticated, 
    isAdmin, 
    deleteCategory
);

module.exports = router;
