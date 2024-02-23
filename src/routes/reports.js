const express = require('express');
const router = express.Router();
const reportsLib = require('../libs/reports');

router.get('/allRevenue', async (req, res) => {
    try {
        const data = await reportsLib.getAllRevenue(req.query.driver, req.query.from, req.query.to);
        res.json(data);
    } catch (err) {
        console.error(err);
    }
});

router.get('/revenuePerMile', async (req, res) => {
    try {
        const data = await reportsLib.getRevenuePerMile(req.query.driver, req.query.from, req.query.to);
        res.json(data);
    } catch (err) {
        console.error(err);
    }
});

router.get('/numberOfMiles', async (req, res) => {
    try {
        const data = await reportsLib.getNumberOfMiles(req.query.driver, req.query.from, req.query.to);
        res.json(data);
    } catch (err) {
        console.error(err);
    }
});

router.get('/loadCount', async (req, res) => {
    try {
        const data = await reportsLib.getCountOfLoads(req.query.driver, req.query.from, req.query.to);
        res.json(data);
    } catch (err) {
        console.error(err);
    }
});

router.get('/expenses', async (req, res) => {
    try {
        const data = await reportsLib.getExpensesByCategory(req.query.from, req.query.to);
        res.json(data);
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;