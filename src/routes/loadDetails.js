const express = require('express');
const router = express.Router();
const loadDetailsLib = require('../libs/loadDetails');

// Fetch All
router.get('/', async (req, res) => {
    try {
        const load = await loadDetailsLib.getAllLoads();
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json(load);
    } catch (err) {
        console.error(err);
    }
});

// Fetch one
router.get('/:id', async (req, res) => {
    try {
        const load = await loadDetailsLib.getLoadById(req.params.id);
        if (load == null) {
            res.status(404).json({ message: 'Cannot find requested id' });
        } 
        res.json(load);
    } catch (err) {
        console.error(err);
    }
});

// Create one
router.post('/', async (req, res) => {
    try {
        const newLoad = await loadDetailsLib.addLoad(req.body);
        res.json(newLoad);
    } catch (err) {
        console.error(err);
    }
});

// Update one
router.patch('/:id', async (req, res) => {
    try {
        const updatedLoad = await loadDetailsLib.updateLoadById(req.params.id, req.body);
        res.json(updatedLoad);
    } catch (err) {
        console.error(err);
    }
});

// Delete one
router.delete('/:id', async (req, res) => {
    try {
        const deletedLoad = await loadDetailsLib.deleteLoadById(req.params.id);
        res.json(deletedLoad);
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;