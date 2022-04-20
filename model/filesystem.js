const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    plazaId: {
        type: Number,
    },
    plazaType: {
        type: String,
    },
    plazaCity: {
        type: String,
    },
    plazaState: {
        type: String,
    },
    plazaName: {
        type: String,
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    }
});

const data = mongoose.model("parkplus_tollmaster", fileSchema);
module.exports = data;