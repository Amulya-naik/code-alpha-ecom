const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

mongoose.connect("mongodb://127.0.0.1:27017/codealpha_store")
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((error) => console.log("MongoDB connection error:", error));

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


// Home
app.get("/", (req, res) => {
    res.send("CodeAlpha E-commerce Backend is Running!");
});

// REGISTER
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log("Register request received:", email);

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        await newUser.save();

        console.log("User registered:", email);

        res.status(201).json({
            message: "Registration successful!"
        });

    } catch (error) {
        console.log("Registration error:", error);

        res.status(500).json({
            message: "Registration failed!"
        });
    }
});

// LOGIN
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Login request received:", email);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password!"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password!"
            });
        }

        res.json({
            message: "Login successful!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log("Login error:", error);

        res.status(500).json({
            message: "Login failed!"
        });
    }
});

// GET PRODUCTS
app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.log("Error fetching products:", error);

        res.status(500).json({
            message: "Failed to fetch products"
        });
    }
});

// CREATE ORDER
app.post("/api/orders", async (req, res) => {
    try {
        const { userEmail, products, totalAmount } = req.body;

        const newOrder = new Order({
            userEmail: userEmail,
            products: products,
            totalAmount: totalAmount
        });

        await newOrder.save();

        console.log("Order saved:", userEmail);

        res.status(201).json({
            message: "Order placed successfully! 🎉"
        });

    } catch (error) {
        console.log("Order error:", error);

        res.status(500).json({
            message: "Failed to place order."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});