// Imports
var express = require('express');
var router = express.Router();
const { check } = require('express-validator');
// Custom Imports
const {signup, signin, signout,} = require("../controllers/auth");

router.post("/signup", [
    check('name')
    .isLength({min: 2}).withMessage('name must be at least 2 chars long'),
    check('email').isEmail().withMessage('email is required'),
    check('password')
    .isLength({ min: 8 }).withMessage('password must be at least 8 chars long')
], signup);

router.post("/signin", [
    check('email').isEmail().withMessage('email is required'),
    check('password')
    .isLength({ min: 2 }).withMessage('password is required')
], signin);

router.get("/signout", signout);

module.exports = router;