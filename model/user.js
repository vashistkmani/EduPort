const mongoose = require('mongoose');


const User = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        require: true,
    },
    instructor: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    userName: {
        type: String,
    },
    phoneNumber: {
        type: Number,
    },
    location: {
        type: String,
    },
    aboutme: {
        type: String,
    },
    image: {
        type: String,
    },
    qualification: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
    },
    randomPassword: {
        type: String,
    }
});

const user = mongoose.model("user", User);
module.exports = user;