const {Order, ProductCart} = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
    Order.find(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
        if(err) {
            return res.status(400).json({
                message: "order not found"
            });
        }
        req.order = order;
        next();
    })
}

exports.getAllOrder = (req, res) => {
    Order.find()
    .populate("user", "_id name")
    .exec((err, order) => {
        if(err) {
            return res.status(400).json({
                message: "order is empty"
            });
        }
        res.json(order)
    })
}

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);

    order.save((err, order) => {
        if(err) {
            return res.status(400).json({
                message: "failed to create order"
            });
        }
        res.json(order);
    })
}

exports.updateStatus = (req, res) => {
    return res.json(Order.schema.path("status").enumValues)
}

exports.getOrderStatus = (req, res) => {
    Order.update(
        {_id: req.body.orderId},
        {$set: {status: req.body.status}},
        (err, order) => {
            if(err) {
                return res.status(400).json({
                    message: "failed to update order"
                });
            }
            res.json(order);
        }
    )
}
