const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },

    products: {
        type: Array,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    orderDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);