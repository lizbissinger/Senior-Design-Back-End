const TruckDetail = require('../models/TruckDetail');

async function addTruck (truck) {
    let newTruck = new TruckDetail ({
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


async function getAllTrucks () {
    let trucks;
    try {
        trucks = await TruckDetail.find();
    } catch (err) {
        console.error(err);
    }
    return trucks;
}

module.exports.addTruck = addTruck;
module.exports.getAllTrucks = getAllTrucks;