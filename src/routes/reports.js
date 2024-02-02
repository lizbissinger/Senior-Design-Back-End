const express = require('express');
const router = express.Router();
const reportsLib = require('../libs/reports');

router.get('/allRevenue', async (req, res) => {
    try {
        const reports = await reportsLib.getAllRevenueByDateRange();
        res.json(reports);
    } catch (err) {
        console.error(err);
    }
});

router.get('/driverRevenue', async (req, res) => {
    try {
        const reports = await reportsLib.getDriverRevenueByDateRange(req.query.driver);
        res.json(reports);
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;