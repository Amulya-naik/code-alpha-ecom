const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect("mongodb://127.0.0.1:27017/codealpha_store")
    .then(async () => {
        console.log("MongoDB connected!");

        await Product.deleteMany({});

        await Product.insertMany([
            {
                name: "Running Shoes",
                price: 1499,
                description: "Comfortable running shoes for everyday use.",
                category: "Footwear"
            },
            {
                name: "Wireless Headphones",
                price: 1999,
                description: "Wireless headphones with clear sound.",
                category: "Electronics"
            },
            {
                name: "Smart Watch",
                price: 2499,
                description: "Smart watch for fitness and daily activities.",
                category: "Electronics"
            },
            {
                name: "Travel Backpack",
                price: 999,
                description: "Spacious backpack for travel and college.",
                category: "Bags"
            }
        ]);

        console.log("Products added successfully!");

        await mongoose.connection.close();
    })
    .catch((error) => {
        console.log("Error:", error);
    });