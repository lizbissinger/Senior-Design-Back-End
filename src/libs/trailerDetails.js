const TrailerDetail = require('../models/TrailerDetail');

async function addTrailer(trailer) {
    let newTrailer = new TrailerDetail({
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

async function getAllTrailers() {
    let trailers;
    try {
        trailers = await TrailerDetail.find();
    } catch (err) {
        console.error(err);
    }
    return trailers;
}

async function getTrailerById(id) {
    let trailer;
    try {
        trailer = await TrailerDetail.findById(id);
    } catch (err) {
        console.error(err);
    }
    return trailer;
}

async function updateTrailerById(id, updatedTrailer) {
    let trailer;
    try {
        updatedTrailer.updatedAt = Date.now();
        trailer = await TrailerDetail.findByIdAndUpdate(id, updatedTrailer, { new: true });
    } catch (err) {
        console.error(err);
    }
    return trailer;
}

async function deleteTrailerById(id) {
    try {
        const trailer = await TrailerDetail.findByIdAndRemove(id);
        return trailer;
    } catch (err) {
        console.error(err);
    }
}

module.exports.addTrailer = addTrailer;
module.exports.getAllTrailers = getAllTrailers;
module.exports.getTrailerById = getTrailerById;
module.exports.updateTrailerById = updateTrailerById;
module.exports.deleteTrailerById = deleteTrailerById;
