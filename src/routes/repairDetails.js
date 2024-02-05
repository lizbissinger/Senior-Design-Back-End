const express = require("express");
const router = express.Router();
const RepairDetailLib = require("../libs/repairDetails");

// Fetch All Repairs
router.get("/", async (req, res) => {
  try {
    const repairs = await RepairDetailLib.getAllRepairs();
    res.json(repairs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;