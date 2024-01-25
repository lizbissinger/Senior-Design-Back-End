const mongoose = require('mongoose');

const TrailerDetailSchema = new mongoose.Schema({
    trailerNumber: {
        type: String,
        required: true
    },
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    vin: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('TrailerDetail', TrailerDetailSchema);
