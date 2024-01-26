const express = require('express');
const router = express.Router();
const trailerDetailsLib = require('../libs/trailerDetails');

// Fetch All Trailers
router.get('/', async (req, res) => {
    try {
        const trailers = await trailerDetailsLib.getAllTrailers();
        res.json(trailers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch One Trailer
router.get('/:id', async (req, res) => {
    try {
        const trailer = await trailerDetailsLib.getTrailerById(req.params.id);
        if (trailer == null) {
            res.status(404).json({ message: 'Cannot find trailer with the requested id' });
        } else {
            res.json(trailer);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create Trailer
router.post('/', async (req, res) => {
    try {
        const newTrailer = await trailerDetailsLib.addTrailer(req.body);
        res.json(newTrailer);
    } catch (err) {
        console.error('Error creating trailer:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update Trailer
router.patch('/:id', async (req, res) => {
    try {
        const updatedTrailer = await trailerDetailsLib.updateTrailerById(req.params.id, req.body);
        res.json(updatedTrailer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete Trailer
router.delete('/:id', async (req, res) => {
    try {
        const deletedTrailer = await trailerDetailsLib.deleteTrailerById(req.params.id);
        res.json(deletedTrailer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
