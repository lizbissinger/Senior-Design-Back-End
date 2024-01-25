const express = require('express');
const router = express.Router();
const trailerDetailsLib = require('../libs/trailerDetails');

// Create Trailer
router.post('/', async (req, res) => {
    try {
        const newTrailer = await trailerDetailsLib.addTrailer(req.body);
        res.json(newTrailer);
    } catch (err) {
        console.error('Error creating Trailer:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Fetch All Trailers
router.get('/', async (req, res) => {
    try {
        const trailer = await trailerDetailsLib.getAllTrailers();
        res.json(trailer);
    } catch (err) {
        console.error(err);
    }
});


module.exports = router;