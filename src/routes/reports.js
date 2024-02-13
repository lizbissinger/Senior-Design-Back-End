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

module.exports = router;