const DriverDetail = require('../models/DriverDetail');

async function addDriver(driver) {
    let newDriver = new DriverDetail({
        name: driver.name,
        licenseNumber: driver.licenseNumber,
        phoneNumber: driver.phoneNumber,
        email: driver.email,
    });
    try {
        newDriver = await newDriver.save();
    } catch (err) {
        console.error(err);
    }
    return newDriver;
}

async function getAllDrivers() {
    let drivers;
    try {
        drivers = await DriverDetail.find();
    } catch (err) {
        console.error(err);
    }
    return drivers;
}

async function getDriverById(id) {
    let driver;
    try {
        driver = await DriverDetail.findById(id);
    } catch (err) {
        console.error(err);
    }
    return driver;
}

async function updateDriverById(id, updatedDriver) {
    let driver;
    try {
        updatedDriver.updatedAt = Date.now();
        driver = await DriverDetail.findByIdAndUpdate(id, updatedDriver, { new: true });
    } catch (err) {
        console.error(err);
    }
    return driver;
}

async function deleteDriverById(id) {
    try {
        const driver = await DriverDetail.findByIdAndRemove(id);
        return driver;
    } catch (err) {
        console.error(err);
    }
}

module.exports.addDriver = addDriver;
module.exports.getAllDrivers = getAllDrivers;
module.exports.getDriverById = getDriverById;
module.exports.updateDriverById = updateDriverById;
module.exports.deleteDriverById = deleteDriverById;
