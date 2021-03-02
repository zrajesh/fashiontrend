const User = require("../models/user");
const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const {sortBy} = require("lodash");
const product = require("../models/product");
const category = require("../models/category");

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
    .exec((err, product) => {
        if(err) {
            return res.status(400).json({
                message: "product not found"
            });
        }
        req.product = product;
        next();
    });
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if(err) {
            return res.status(400).json({
                message: "image not compatible"
            });
        }
        const {name, description, price, category, stock} = fields;
        // Restriction on fields
        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ) {
        return res.status(400).json({
            message: "please fill all the fields"
        });
    }
    let product = new Product(fields);
    // handle file
    if(file.photo) {
        if(file.photo.size > 3000000) {
            return res.status(400).json({
                error: "file size too big"
            })
        }
        product.photo.data = fs.readFileSync(file.photo.path);
        product.photo.contentType = file.photo.type;
    }
    // save to db
    product.save((err, product) => {
        if(err) {
            return res.json({
                error: "product cannot be created"
            });
        }
        res.json(product);
    });
    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}
// Middleware for photo
exports.photo = (req, res, next) => {
    if(req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, product) => {
        if(err) {
            return res.json({
                error: "failed to delete product"
            });
        }
        res.json({
            message: `${product.name} successfully deleted`
        })
    });
}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if(err) {
            return res.status(400).json({
                message: "image not compatible"
            });
        }
        // updation
        let product = req.product;
        product = _.extend(product, fields);
        // handle file
        if(file.photo) {
            if(file.photo.size > 3000000) {
            return res.status(400).json({
                error: "file size too big"
            })
        }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        // save to db
        product.save((err, product) => {
            if(err) {
                return res.json({
                    error: "failed to update"
            });
        }
        res.json(product);
    });
    })
}

exports.getAllProduct = (req, res) => {
    //let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
    Product.find()
    .select("-photo")
    .sort([[sortBy, "asc"]])
    //.limit(limit)
    .exec((err, products) => {
        if(err) {
            return res.json({
                error: "failed to get all product"
            });
        }
        res.json(products);
    })
}

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if(err) {
            return res.json({
                error: "category not found"
            });
        }
        res.json(category);
    })
}

exports.updateStock = (req, res, next) => {
    let myOperation = req.body.order.products.map(product => {
        return {
            updateOne: {
                filter: {_id: product._id},
                update: {$inc: {stock: -product.count, sold: +product.count}}
            }
        }
    })
    product.bulkWrite(myOperation, {}, (err, products) => {
        if(err) {
            return res.status(400).json({
                error: "bulk operation failed"
            });
        }
        next();
    })
}
