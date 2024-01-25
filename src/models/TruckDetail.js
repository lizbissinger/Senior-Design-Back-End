const mongoose = require('mongoose');

const TruckDetailSchema = new mongoose.Schema({
    truckNumber: {
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

module.exports = mongoose.model('TruckDetail', TruckDetailSchema);
