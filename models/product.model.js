const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    images: [{
      type: String 
    }],
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      enum: ['shortboard', 'longboard', 'fish', 'funboard', 'gun', 'hybrid'],
      required: true
    },
  }, { timestamps: true });


  const Product = mongoose.model('Product', productSchema);
  module.exports = Product;