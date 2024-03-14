const express = require("express");
const router = express.Router();
const RepairDetailLib = require("../libs/repairDetails");
const { deleteDriverById } = require("../libs/driverDetails");

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

//Create Repair
router.post("/", async (req, res) => {
  try {
    const newRepair = await RepairDetailLib.addRepair(req.body);
    res.json(newRepair);
  } catch (err) {
    console.error("Error creating Repair:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update repair
router.patch("/:id", async (req, res) => {
  try {
    const updatedRepair = await RepairDetailLib.updateRepairById(
      req.params.id,
      req.body
    );
    res.json(updatedRepair);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete repair
router.delete('/:id', async (req, res) => {
  try {
      const deletedRepair = await RepairDetailLib.deleteRepairById(req.params.id);
      res.json(deletedRepair);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
