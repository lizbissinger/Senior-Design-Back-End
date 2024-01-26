const TruckDetail = require('../models/TruckDetail');

async function addTruck(truck) {
    let newTruck = new TruckDetail({
        truckNumber: truck.truckNumber,
        make: truck.make,
        model: truck.model,
        year: truck.year,
        vin: truck.vin
    });
    try {
        newTruck = await newTruck.save();
    } catch (err) {
        console.error(err);
    }
    return newTruck;
}

async function getAllTrucks() {
    let trucks;
    try {
        trucks = await TruckDetail.find();
    } catch (err) {
        console.error(err);
    }
    return trucks;
}

async function getTruckById(id) {
    let truck;
    try {
        truck = await TruckDetail.findById(id);
    } catch (err) {
        console.error(err);
    }
    return truck;
}

async function updateTruckById(id, updatedTruck) {
    let truck;
    try {
        updatedTruck.updatedAt = Date.now();
        truck = await TruckDetail.findByIdAndUpdate(id, updatedTruck, { new: true });
    } catch (err) {
        console.error(err);
    }
    return truck;
}

async function deleteTruckById(id) {
    try {
        const truck = await TruckDetail.findByIdAndRemove(id);
        return truck;
    } catch (err) {
        console.error(err);
    }
}

module.exports.addTruck = addTruck;
module.exports.getAllTrucks = getAllTrucks;
module.exports.getTruckById = getTruckById;
module.exports.updateTruckById = updateTruckById;
module.exports.deleteTruckById = deleteTruckById;
