const User = require("../models/user");
const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, item) => {
        if(err) {
            return res.status(400).json({
                error: "category not found"
            })
        }
        req.category = item;
        next();
    })
}
// Create
exports.createCategory = (req, res) => {
    let category = new Category(req.body);
    category.save((err, category) => {
        if(err) {
            return res.status(400).json({
                error: "cannot create category"
            })
        }
        res.json({category});
    });
}
// Read
exports.getCategory = (req, res) => {
    return res.json(req.category);
}

exports.getAllCategory = (req, res) => {
    Category.find().exec((err, categories) => {
        if(err) {
            return res.status(400).json({
                error: "no categories found"
            })
        }
        res.json(categories);
    });
}
// Update
exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save((err, updatedCategory) => {
        if(err) {
            return res.status(400).json({
                error: "failed to update category"
            })
        }
        res.json(updatedCategory);
    });
}
// Delete
exports.deleteCategory = (req, res) => {
    const category = req.category;
    category.remove((err, cateogry) => {
        if(err) {
            return res.status(400).json({
                error: "failed to delete category"
            })
        }
        res.json({
            message: `${cateogry.name} successfully deleted`
        });   
    });
}
