const express = require('express');
const router = express.Router();
const driverDetailsLib = require('../libs/driverDetails');

// Fetch All Drivers
router.get('/', async (req, res) => {
    try {
        const drivers = await driverDetailsLib.getAllDrivers();
        res.json(drivers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch One Driver
router.get('/:id', async (req, res) => {
    try {
        const driver = await driverDetailsLib.getDriverById(req.params.id);
        if (driver == null) {
            res.status(404).json({ message: 'Cannot find driver with the requested id' });
        } else {
            res.json(driver);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create Driver
router.post('/', async (req, res) => {
    try {
        const newDriver = await driverDetailsLib.addDriver(req.body);
        res.json(newDriver);
    } catch (err) {
        console.error('Error creating driver:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update Driver
router.patch('/:id', async (req, res) => {
    try {
        const updatedDriver = await driverDetailsLib.updateDriverById(req.params.id, req.body);
        res.json(updatedDriver);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete Driver
router.delete('/:id', async (req, res) => {
    try {
        const deletedDriver = await driverDetailsLib.deleteDriverById(req.params.id);
        res.json(deletedDriver);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
