const DriverDetail = require('../models/DriverDetail');

async function addDriver (driver) {
    let newDriver = new DriverDetail ({
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


async function getAllDrivers () {
    let drivers;
    try {
        drivers = await DriverDetail.find();
    } catch (err) {
        console.error(err);
    }
    return drivers;
}

module.exports.addDriver = addDriver;
module.exports.getAllDrivers = getAllDrivers;