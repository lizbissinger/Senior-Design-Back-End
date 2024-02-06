const RepairDetail = require('../models/RepairDetail');


async function addRepair(repair) {
    let newRepair = new RepairDetail({
        repair: repair.repair,
        repairCost: repair.repairCost,
        repairDate: repair.repairDate,
        repairComments: repair.repairComments,
        truckObject: repair.truckObject,
        trailerObject: repair.trailerObject
    });
    try {
        newRepair = await newRepair.save();
    } catch (err) {
        console.error(err);
    }
    return newRepair;
}

async function getAllRepairs() {
    let repairs;
    try {
        repairs = await RepairDetail.find();
    } catch (err) {
        console.error(err);
    }
    return repairs;
}

module.exports.addRepair = addRepair;
module.exports.getAllRepairs = getAllRepairs;