const express = require("express");
const router = express.Router();
const PayrollDetailLib = require("../libs/payrollDetails");

// Fetch All Payrolls
router.get("/", async (req, res) => {
  try {
    const payroll = await PayrollDetailLib.getAllPayroll();
    res.json(payroll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Create payroll
router.post("/", async (req, res) => {
  try {
    const newPayroll = await PayrollDetailLib.addPayroll(req.body);
    res.json(newPayroll);
  } catch (err) {
    console.error("Error creating Payroll", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updatedPayroll = await PayrollDetailLib.updatePayrollById(
      req.params.id,
      req.body
    );
    res.json(updatedPayroll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete payroll
router.delete('/:id', async (req, res) => {
  try {
      const deletedPayroll = await PayrollDetailLib.deletePayrollById(req.params.id);
      res.json(deletedPayroll);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;