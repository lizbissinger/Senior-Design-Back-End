const PayrollDetail = require('../models/PayrollDetail');


async function addPayroll(payroll) {
   
    let newPayroll = new PayrollDetail({
        driver: payroll.driver,
        payrollCost: payroll.payrollCost,
        payrollDate: payroll.payrollDate
       
    });
    try {
        newPayroll = await newPayroll.save();
    } catch (err) {
        console.error(err);
    }
    return newPayroll;
}

async function getAllPayroll() {
    
    let payroll;
    try {
        payroll = await PayrollDetail.find();
    } catch (err) {
        console.error(err);
    }
    return payroll;
}

module.exports.addPayroll = addPayroll;
module.exports.getAllPayroll = getAllPayroll;