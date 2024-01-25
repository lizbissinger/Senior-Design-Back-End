const express = require("express");
const router = express.Router();
const truckDetailsLib = require("../libs/truckDetails");

// Create Truck
router.post("/", async (req, res) => {
  try {
    const newTruck = await truckDetailsLib.addTruck(req.body);
    res.json(newTruck);
  } catch (err) {
    console.error("Error creating Truck:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch All Trucks
router.get("/", async (req, res) => {
  try {
    const truck = await truckDetailsLib.getAllTrucks();
    res.json(truck);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
