const Fuel = require("../models/Fuel");

async function addFuel(fuel) {
  let newFuel = new Fuel({
    cost: fuel.cost,
    truckObject: fuel.truckObject,
    date: fuel.date,
    comments: fuel.comments,
  });
  try {
    newFuel = await newFuel.save();
  } catch (err) {
    console.error(err);
  }
  return newFuel;
}

async function getAllFuelRows() {
  let fuel;
  try {
    fuel = await Fuel.find();
  } catch (err) {
    console.error(err);
  }
  return fuel;
}

async function updateFuelById(id, updateData) {
  try {
    const updatedFuel = await Fuel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return updatedFuel;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports.addFuel = addFuel;
module.exports.getAllFuelRows = getAllFuelRows;
module.exports.updateFuelById = updateFuelById;
