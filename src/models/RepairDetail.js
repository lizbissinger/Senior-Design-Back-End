const mongoose = require('mongoose');

const RepairDetailSchema = new mongoose.Schema({
    repair: {
        type: String,
        required: true
    },
    repairCost: {
        type: String,
        required: true
    },
    truckObject: {
        type: String,
        required: false
    },
    repairDate: {
        type: String,
        required: false
    },
    trailerobject: {
        type: String,
        required: false
    },
    repairComments: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('RepairDetail', RepairDetailSchema);