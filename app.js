// Imports
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
// Route Imports
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const { buildCheckFunction } = require("express-validator");

// DB Connection
mongoose.connect(process.env.DATABASE, 
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("DB CONNECTED");
}).catch((err) => {
    console.log(err);
})

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
// Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
// serving static assets (production)
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    })
} 
else {
    app.get('/', (req, res) => {
        res.send("API running")
    })
}

// Port number
const port = process.env.PORT || 5000;

// Listening to server
app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
});
