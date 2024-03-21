const express = require("express");
const router = express.Router();
const financeLib = require("../libs/finance");

// Get finance tab revenue data
router.get("/revenue", async (req, res) => {
  try {
    const data = await financeLib.getAllRevenue(
      req.query.groupBy,
      req.query.driver,
      req.query.truck,
      req.query.from,
      req.query.to
    );
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
