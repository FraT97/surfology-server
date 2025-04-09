const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");
const { isAdmin } = require('../middleware/admin.middleware');

// GET all products
router.get("/surfboards", (req, res) => {
    Product.find()
      .then((products) => {
        res.status(200).json({ success: true, products }); 
      })
      .catch((error) => {
        console.error("Error fetching products:", error); 
        res.status(500).json({ success: false, error: error.message });
      });
});

// GET specific product by ID
router.get("/surfboards/:id", (req, res) => {
    Product.findById(req.params.id)
    .then((product) => {
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, product });
    })
    .catch((error) => {
        console.error("Error fetching product:", error); 
        res.status(500).json({ success: false, error: error.message });
    });
});

// ADMIN Routes

// POST: Create a new product (admin only)
router.post("/surfboards", isAdmin, (req, res) => {
    Product.create(req.body)
    .then((product) => {
        res.status(201).json({ success: true, product });
    })
    .catch((error) => {
        console.error("Error creating product:", error); 
        res.status(400).json({ success: false, error: error.message });
    });
});

// PUT: Update a product (admin only)
router.put("/surfboards/:id", isAdmin, (req, res) => {
    Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((product) => {
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, product });
    })
    .catch((error) => {
        console.error("Error updating product:", error); 
        res.status(400).json({ success: false, error: error.message });
    });
});

// DELETE: Delete a product (admin only)
router.delete("/surfboards/:id", isAdmin, (req, res) => {
    Product.findByIdAndDelete(req.params.id)
    .then((product) => {
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(204).json({ success: true, message: "Product deleted" });
    })
    .catch((error) => {
        console.error("Error deleting product:", error); 
        res.status(400).json({ success: false, error: error.message });
    });
});

module.exports = router;
