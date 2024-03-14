const RepairDetail = require("../models/RepairDetail");

async function addRepair(repair) {
  let newRepair = new RepairDetail({
    repair: repair.repair,
    repairCost: repair.repairCost,
    repairDate: repair.repairDate,
    repairComments: repair.repairComments,
    truckObject: repair.truckObject,
    trailerObject: repair.trailerObject,
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

async function updateRepairById(id, updateData) {
  try {
    const updatedRepair = await RepairDetail.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return updatedRepair;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function deleteRepairById(id) {
  try {
    const repair = await RepairDetail.findByIdAndRemove(id);
    return repair;
  } catch (err) {
    console.error(err);
  }
}

module.exports.addRepair = addRepair;
module.exports.getAllRepairs = getAllRepairs;
module.exports.updateRepairById = updateRepairById;
module.exports.deleteRepairById = deleteRepairById;
