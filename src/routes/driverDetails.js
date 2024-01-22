const express = require('express');
const router = express.Router();
const driverDetailsLib = require('../libs/driverDetails');

// Create driver
router.post('/', async (req, res) => {
    try {
        const newDriver = await driverDetailsLib.addDriver(req.body);
        res.json(newDriver);
    } catch (err) {
        console.error('Error creating driver:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Fetch All Drivers
router.get('/', async (req, res) => {
    try {
        const driver = await driverDetailsLib.getAllDrivers();
        res.json(driver);
    } catch (err) {
        console.error(err);
    }
});


module.exports = router;