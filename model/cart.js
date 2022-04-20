const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    item: {
        type: Array,
        qty: Number,
    },
    date: {
        type: Date,
        default: Date.now
    },
    
});

const cart = mongoose.model("cart", cartSchema);
module.exports = cart;