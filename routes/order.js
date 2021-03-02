// Imports
const express = require("express");
const router = express.Router();
// Custom Imports
const {
    getOrderById,
    getAllOrder,
    createOrder,
    updateStatus,
    getOrderStatus
} =  require("../controllers/order")
const {
    getUSerById, 
    pushOrderInPurchaseList
} = require("../controllers/user");
const {
    isSignedIn, 
    isAuthenticated, 
    isAdmin
} = require("../controllers/auth");
const { updateStock } = require("../controllers/product");

// Params
router.param("userId", getUSerById);
router.param("orderId", getOrderById);
// Routes
// Read
router.get("/order/all",
 isSignedIn, 
 isAuthenticated, 
 isAdmin, 
 getAllOrder
);
// Create
router.post("/order/create/:userId",
 isSignedIn, 
 isAuthenticated, 
 pushOrderInPurchaseList,
 updateStock,
 createOrder
);
// Status
router.get("/order/status/:userId",
 isSignedIn, 
 isAuthenticated, 
 isAdmin, 
 getOrderStatus
);
router.put("/order/:orderId/status/:userId",
 isSignedIn, 
 isAuthenticated, 
 isAdmin, 
 updateStatus
);


module.exports = router;