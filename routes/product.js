// Imports
const express = require("express");
const router = express.Router();
// Custom Imports
const {
    getProductById, 
    getProduct, 
    createProduct, 
    photo,
    deleteProduct,
    updateProduct,
    getAllProduct,
    getAllUniqueCategories,
} =  require("../controllers/product")
const {getUSerById} = require("../controllers/user");
const {getCategoryById} = require("../controllers/category");
const {
    isSignedIn, 
    isAuthenticated, 
    isAdmin
} = require("../controllers/auth");

// Params
router.param("userId", getUSerById);
router.param("productId", getProductById);
router.param("categoryId", getCategoryById);

// Routes
// Create
router.post("/product/create/:userId",
 isSignedIn, 
 isAuthenticated, 
 isAdmin,
 createProduct
)
// Read
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);
// Delete
router.delete("/product/:productId/:userId",
 isSignedIn, 
 isAuthenticated, 
 isAdmin, 
 deleteProduct
);
// Update
router.put("/product/:productId/:userId",
 isSignedIn, 
 isAuthenticated, 
 isAdmin, 
 updateProduct
);
// Listing route
router.get("/products", getAllProduct);
// Getting unique category
router.get("/products/categories", getAllUniqueCategories);

module.exports = router;
