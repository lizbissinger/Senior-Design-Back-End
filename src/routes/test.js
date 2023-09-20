const express = require('express');
const router = express.Router();
const testLib = require('../libs/test');

// Fetch All
router.get('/', async (req, res) => {
    try {
        const test = await testLib.getAllTests();
        res.json(test);
    } catch (err) {
        console.error(err);
    }
});

// Fetch one
router.get('/:id', (req, res) => {

});

// Create one
router.post('/', async (req, res) => {
    try {
        const newTest = await testLib.addTest(req.body);
        res.json(newTest);
    } catch (err) {
        console.error(err);
    }
});

// Update one
router.patch('/:id', (req, res) => {

});

// Delete one
router.delete('/:id', (req, res) => {

});

module.exports = router;