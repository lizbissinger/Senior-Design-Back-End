const express = require("express");
const router = express.Router();
const truckDetailsLib = require("../libs/truckDetails");

// Fetch All Trucks
router.get("/", async (req, res) => {
  try {
    const trucks = await truckDetailsLib.getAllTrucks();
    res.json(trucks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch One Truck
router.get("/:id", async (req, res) => {
  try {
    const truck = await truckDetailsLib.getTruckById(req.params.id);
    if (truck == null) {
      res.status(404).json({ message: "Cannot find truck with the requested id" });
    } else {
      res.json(truck);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create Truck
router.post("/", async (req, res) => {
  try {
    const newTruck = await truckDetailsLib.addTruck(req.body);
    res.json(newTruck);
  } catch (err) {
    console.error("Error creating truck:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update Truck
router.patch("/:id", async (req, res) => {
  try {
    const updatedTruck = await truckDetailsLib.updateTruckById(req.params.id, req.body);
    res.json(updatedTruck);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete Truck
router.delete("/:id", async (req, res) => {
  try {
    const deletedTruck = await truckDetailsLib.deleteTruckById(req.params.id);
    res.json(deletedTruck);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
