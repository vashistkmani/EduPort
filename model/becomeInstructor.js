const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    date: {
        type: Date,
        default: Date.now
    },
});

let becomeInstructor = mongoose.model("instructorReview", instructorSchema);
module.exports = becomeInstructor;