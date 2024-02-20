const express = require("express");
const router = express.Router();
const multer = require("multer");
const loadDetailsLib = require("../libs/loadDetails");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Fetch All
router.get("/", async (req, res) => {
  try {
    const load = await loadDetailsLib.getAllLoads();
    res.json(load);
  } catch (err) {
    console.error(err);
  }
});

// Fetch one
router.get("/:id", async (req, res) => {
  try {
    const load = await loadDetailsLib.getLoadById(req.params.id);
    if (load == null) {
      res.status(404).json({ message: "Cannot find requested id" });
    }
    res.json(load);
  } catch (err) {
    console.error(err);
  }
});

// Create one
router.post("/", upload.array("documents", 5), async (req, res) => {
  let load = req.body;

  if (typeof load === "string") {
    load = JSON.parse(load);
  }

  if (req.files && req.files.length > 0) {
    load.documents = req.files.map((file) => ({
      data: file.buffer,
      contentType: file.mimetype,
      fileName: file.originalname,
    }));
  }

  try {
    const newLoad = await loadDetailsLib.addLoad(load);
    res.status(201).json(newLoad);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});
// Update Load
router.patch("/:id", upload.array("documents"), async (req, res) => {
  const documents = req.files.map((file) => ({
    data: file.buffer,
    contentType: file.mimetype,
    fileName: file.originalname,
  }));

  const updateData = {
    ...req.body,
    documents: documents,
    updatedAt: new Date(),
  };

  try {
    const updatedLoad = await loadDetailsLib.updateLoadById(
      req.params.id,
      updateData
    );
    res.json(updatedLoad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Delete one
router.delete("/:id", async (req, res) => {
  try {
    const deletedLoad = await loadDetailsLib.deleteLoadById(req.params.id);
    res.json(deletedLoad);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
