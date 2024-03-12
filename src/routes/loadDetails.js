const express = require("express");
const router = express.Router();
const multer = require("multer");
const loadDetailsLib = require("../libs/loadDetails");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const LoadDetail = require("../models/LoadDetail");

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
  } else {
    load.documents = load.documents || [];
  }

  try {
    const newLoad = await loadDetailsLib.addLoad(load);
    res.status(201).json(newLoad);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id", upload.array("documents"), async (req, res) => {
  const documentUpdates = req.files
    ? req.files.map((file) => ({
        data: file.buffer,
        contentType: file.mimetype,
        fileName: file.originalname,
      }))
    : [];

  const { documents: _, updatedAt: __, ...restOfBody } = req.body;

  try {
    const existingLoad = await loadDetailsLib.getLoadById(req.params.id);

    const filteredDocumentUpdates = documentUpdates.filter(
      (newDoc) =>
        !existingLoad.documents.some(
          (existingDoc) => existingDoc.fileName === newDoc.fileName
        )
    );

    const updateData = {
      ...restOfBody,
      documents: [...existingLoad.documents, ...filteredDocumentUpdates],
      updatedAt: new Date(),
    };

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

// Fetches ONLY the metadata of all documents for a specific load
router.get("/:loadId/documents/metadata", async (req, res) => {
  const { loadId } = req.params;

  try {
    const load = await LoadDetail.findById(
      loadId,
      "documents.fileName documents.contentType documents._id"
    );
    if (!load) {
      return res.status(404).json({ message: "Load not found" });
    }

    const documentsMetadata = load.documents.map((doc) => ({
      _id: doc._id,
      fileName: doc.fileName,
      contentType: doc.contentType,
    }));

    res.json({ documents: documentsMetadata });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint to fetch all documents including binary data for a specific load
router.get("/:loadId/documents", async (req, res) => {
  const { loadId } = req.params;

  try {
    const load = await LoadDetail.findById(loadId).select("documents");
    if (!load) {
      return res.status(404).json({ message: "Load not found" });
    }
    if (load.documents && load.documents.length > 0) {
      const documentsWithBinaryData = load.documents.reduce((acc, doc) => {
        if (doc.data) {
          acc.push({
            _id: doc._id,
            fileName: doc.fileName,
            contentType: doc.contentType,
            data: doc.data.toString("base64"),
          });
        }
        return acc;
      }, []);

      res.json({ documents: documentsWithBinaryData });
    } else {
      res.json({ documents: [] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint to fetch a specific document's binary data
router.get("/:loadId/documents/:documentId", async (req, res) => {
  const { loadId, documentId } = req.params;

  try {
    const load = await LoadDetail.findById(loadId);
    if (!load) {
      return res.status(404).json({ message: "Load not found" });
    }

    const document = load.documents.id(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.type(document.contentType);

    res.send(document.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a specific document within a load
router.delete("/:loadId/documents/:documentId", async (req, res) => {
  const { loadId, documentId } = req.params;

  try {
    const load = await LoadDetail.findById(loadId);
    if (!load) {
      return res.status(404).json({ message: "Load not found" });
    }

    const documentIndex = load.documents.findIndex(
      (doc) => doc._id.toString() === documentId
    );
    if (documentIndex === -1) {
      return res.status(404).json({ message: "Document not found" });
    }

    load.documents.splice(documentIndex, 1);

    const updatedLoad = await load.save();

    res.json(updatedLoad);
    console.log("DOCUMENT  DELETED");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
