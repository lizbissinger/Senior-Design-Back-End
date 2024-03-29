const express = require("express");
const router = express.Router();
const FuelLib = require("../libs/fuel");

// Fetch All Fuel Rows
router.get("/", async (req, res) => {
  try {
    const data = await FuelLib.getAllFuelRows();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Create Fuel Row
router.post("/", async (req, res) => {
  try {
    const newFuelRow = await FuelLib.addFuel(req.body);
    res.json(newFuelRow);
  } catch (err) {
    console.error("Error creating Fuel:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updatedFuel = await FuelLib.updateFuelById(req.params.id, req.body);
    res.json(updatedFuel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete fuel
router.delete("/:id", async (req, res) => {
  try {
    const deletedFuel = await FuelLib.deleteFuelById(
      req.params.id
    );
    res.json(deletedFuel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
