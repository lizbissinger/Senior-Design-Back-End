const TrailerDetail = require('../models/TrailerDetail');

async function addTrailer (trailer) {
    let newTrailer = new TrailerDetail ({
        trailerNumber: trailer.trailerNumber,
        make: trailer.make,
        model: trailer.model,
        year: trailer.year,
        vin: trailer.vin
    });
    try {
        newTrailer = await newTrailer.save();
    } catch (err) {
        console.error(err);
    }
    return newTrailer;
}


async function getAllTrailers () {
    let trailers;
    try {
        trailers = await TrailerDetail.find();
    } catch (err) {
        console.error(err);
    }
    return trailers;
}

module.exports.addTrailer = addTrailer;
module.exports.getAllTrailers = getAllTrailers;