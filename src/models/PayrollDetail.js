const mongoose = require('mongoose');

const PayrollDetailSchema = new mongoose.Schema({
    driver: {
        type: String,
        required: true
    },
    payrollCost: {
        type: String,
        required: true
    },

    payrollDate: {
        type: String,
        required: false
    }

});

module.exports = mongoose.model('PayrollDetail', PayrollDetailSchema);