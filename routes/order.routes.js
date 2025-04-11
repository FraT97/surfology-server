const express = require("express");
const router = express.Router();
const Order = require('../models/order.model');
const { isAdmin } = require('../middleware/admin.middleware');
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');

 

router.post('/orders', isAuthenticated, async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      user: req.payload._id,
    };

    const newOrder = await Order.create(orderData);

    
    await User.findByIdAndUpdate(
      req.payload._id,
      { $push: { orders: newOrder._id } },
      { new: true }
    );

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error. Check the server console" });
  }
});



router.get('/orders/user/:userId', isAuthenticated, async (req, res) => {
    try {
      const orders = await Order.find({ user: req.params.userId })
        .populate('products.product')  
        .populate('user');             
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found for this user." });
      }
  
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Internal server error" });
    }
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
