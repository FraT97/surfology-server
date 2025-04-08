// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const mongoose = require('mongoose');
const app = express();



const User = require('./models/User.model');
const Product = require('./models/product.model');
const Order = require('./models/order.model');
const { isAuthenticated } = require('./middleware/jwt.middleware');  
const { isAdmin } = require('./middleware/admin.middleware');


// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);





// 👇 Start handling routes here
const productRoutes = require('./routes/product.routes');
app.use('/api', isAuthenticated, productRoutes);

const orderRoutes = require('./routes/order.routes');
app.use('/api', isAuthenticated, orderRoutes);

const userRoutes = require('./routes/user.routes');
app.use('/api', isAuthenticated, userRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const adminRoutes = require('./routes/admin.routes');
app.use('/admin', isAuthenticated, adminRoutes);




// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
