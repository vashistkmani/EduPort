const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    courseTitle: {
        type: String,
        // unique: true,
    },
    sortDescription: {
        type: String,
    },
    courseCategory: {
        type: String,
    },
    courseLevel: {
        type: String,
    },
    language: {
        type: String,
    },
    courseTime: {
        type: Number,
    },
    totalLecture: {
        type: Number,
    },
    coursePrice: {
        type: Number,
    },
    discountPrice: {
        type: Number,
    },
    image: {
        type: String,
    },
    FAQ: {
        type: Array,
    },
    tag: {
        type: String
    },
    message: {
        type: String
    },
    addDescription: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    quantity: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const course = mongoose.model("course", courseSchema);

module.exports = course;