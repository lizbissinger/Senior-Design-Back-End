const LoadDetail = require('../models/LoadDetail');

async function getAllLoads () {
    let loads;
    try {
        loads = await LoadDetail.find();
    } catch (err) {
        console.error(err);
    }
    return loads;
}

async function addLoad (load) {
    let newLoad = new LoadDetail ({
        loadNumber: load.loadNumber,
        truckObject: load.truckObject,
        trailerObject: load.trailerObject,
        driverObject: load.driverObject,
        pickupLocation: load.pickupLocation,
        deliveryLocation: load.deliveryLocation,
        pickupTime: load.pickupTime,
        deliveryTime: load.deliveryTime,
        documents: load.documents,
        price: load.price,
        detentionPrice: load.detentionPrice,
        allMiles: load.allMiles,
        fuelGallons: load.fuelGallons,
        status: load.status,
        brokerInfo: load.brokerInfo.name,
        comments: load.comments,
        createdAt: Date.now(),
        updatedAt: Date.now()
    });
    try {
        newLoad = await newLoad.save();
    } catch (err) {
        console.error(err);
    }
    return newLoad;
}

async function getLoadById (id) {
    let load;
    try {
        load = await LoadDetail.findById(id);
    } catch (err) {
        console.error(err);
    }
    return load;
}

async function updateLoadById (id, load) {
    let updatedLoad;
    load.updatedAt = Date.now();
    try {
        updatedLoad = await LoadDetail.updateOne({ _id: id }, load);
    } catch (err) {
        console.error(err);
    }
    return updatedLoad;
}

async function deleteLoadById (id) {
    try {
        const load = await LoadDetail.findByIdAndRemove(id);
        return load;
    } catch (err) {
        console.error(err);
    }
}

module.exports.getAllLoads = getAllLoads;
module.exports.addLoad = addLoad;
module.exports.getLoadById = getLoadById;
module.exports.updateLoadById = updateLoadById;
module.exports.deleteLoadById = deleteLoadById;