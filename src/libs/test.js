const Test = require('../models/test');

async function getAllTests() {
    let test;
    try {
        test = await Test.find();
    } catch (err) {
        console.error(err);
    }
    return test;
}

async function addTest(test) {
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

module.exports.getAllTests = getAllTests;
module.exports.addTest = addTest;