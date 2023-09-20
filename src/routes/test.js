const express = require('express');
const router = express.Router();
const Test = require('../models/test');

// Fetch All
router.get('/', async (req, res) => {
    try {
        const test = await Test.find();
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
    const test = new Test({
        name: req.body.name,
        description: req.body.description
    })
    try {
        const newTest = await test.save();
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