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
router.get('/:id', async (req, res) => {
    try {
        const test = await testLib.getById(req.params.id);
        if (test == null) {
            res.status(404).json({ message: 'Cannot find requested id' });
        } 
        res.json(test);
    } catch (err) {
        console.error(err);
    }
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
router.patch('/:id', async (req, res) => {
    try {
        const updatedTest = await testLib.updateById(req.params.id, req.body);
        res.json(updatedTest);
    } catch (err) {
        console.error(err);
    }
});

// Delete one
router.delete('/:id', async (req, res) => {
    try {
        const deletedTest = await testLib.deleteById(req.params.id);
        res.json(deletedTest);
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
