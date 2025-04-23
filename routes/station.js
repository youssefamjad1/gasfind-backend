import express from 'express';
import Station from '../models/Station.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// Only admins can upload stations
router.post('/upload', verifyToken, async (req, res) => {
  const { stations } = req.body;

  try {
    for (let s of stations) {
      await Station.findOneAndUpdate(
        { name: s.name },
        {
          name: s.name,
          address: s.address,
          location: {
            type: 'Point',
            coordinates: [parseFloat(s.longitude), parseFloat(s.latitude)],
          },
          gazoilPrice: parseFloat(s.gazoilPrice),
          dieselPrice: parseFloat(s.dieselPrice),
        },
        { upsert: true, new: true }
      );
    }

    res.json({ message: 'Stations uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
