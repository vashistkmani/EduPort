const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    orderId: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    mobileNo: {
        type: Number,
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    address: {
        type: String,
    },
    postalCode: {
        type: Number,
    },
    item: {
        type: Array,
    },
    orderSummary: {
        type: Object,
    },
    response: {
        type: Object
    }
});

let orders = mongoose.model("order", orderSchema);

module.exports = orders;