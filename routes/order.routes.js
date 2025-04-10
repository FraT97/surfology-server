const express = require("express");

const router = express.Router();
const Order = require('../models/order.model');
const { isAdmin } = require('../middleware/admin.middleware');


const { isAuthenticated } = require('../middleware/jwt.middleware');

router.post('/orders', isAuthenticated, (req, res) => {
  const orderData = {
    ...req.body,
    user: req.payload._id, 
  };

  Order.create(orderData)
    .then(order => res.status(201).json(order))
    .catch(error => res.status(400).json(error));
});


router.get('/orders/user/:userId', isAuthenticated, (req, res) => {
    Order.find({ user: req.params.userId })
        .then(orders => res.status(200).json(orders))
        .catch(error => res.status(400).json(error));
});

// ADMIN ROUTES


router.get('/orders', isAdmin, (req, res) => {
    Order.find()
        .then(orders => res.status(200).json(orders))
        .catch(error => res.status(400).json(error));
});


router.get('/orders/id/:id', isAdmin, (req, res) => {
    Order.findById(req.params.id)
        .then(order => {
            if (!order) return res.status(404).json({ message: "Order not found" });
            res.status(200).json(order);
        })
        .catch(error => res.status(400).json(error));
});


router.get('/orders/admin/user/:userId', isAdmin, (req, res) => {
    Order.find({ userId: req.params.userId })
        .then(orders => res.status(200).json(orders))
        .catch(error => res.status(400).json(error));
});

module.exports = router;
