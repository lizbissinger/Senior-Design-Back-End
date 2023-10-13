const Test = require('../models/test');

async function getAllTests () {
    let test;
    try {
        test = await Test.find();
    } catch (err) {
        console.error(err);
    }
    return test;
}

async function addTest (test) {
    let newTest = new Test ({
        name: test.name,
        description: test.description
    });
    try {
        newTest = await newTest.save();
    } catch (err) {
        console.error(err);
    }
    return newTest;
}

async function getById (id) {
    let test;
    try {
        test = await Test.findById(id);
    } catch (err) {
        console.error(err);
    }
    return test;
}

async function updateById (id, test) {
    let updatedTest;
    test.updatedAt = Date.now();
    try {
        updatedTest = await Test.updateOne({ _id: id }, test);
    } catch (err) {
        console.error(err);
    }
    return updatedTest;
}

async function deleteById (id) {
    try {
        const test = await Test.findByIdAndRemove(id);
        return test;
    } catch (err) {
        console.error(err);
    }
}

module.exports.getAllTests = getAllTests;
module.exports.addTest = addTest;
module.exports.getById = getById;
module.exports.updateById = updateById;
module.exports.deleteById = deleteById;
