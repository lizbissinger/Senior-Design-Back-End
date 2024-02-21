const mongoose = require('mongoose');

const FuelSchema = new mongoose.Schema({
    cost: {
        type: String,
        required: true
    },
    truckObject: {
        type: String,
        required: false
    },
    date: {
        type: String,
        required: false
    },
    comments: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Fuel', FuelSchema);