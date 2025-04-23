import express from 'express';
import Station from '../models/Station.js';
import cors from 'cors';

const router = express.Router();

// Allow CORS for cross-origin requests
router.use(cors());

// POST - Add a new station
router.post('/', async (req, res) => {
  try {
    const { name, address, location, gazoilPrice, dieselPrice } = req.body;

    const newStation = new Station({
      name,
      address,
      location, // should be: { type: "Point", coordinates: [lng, lat] }
      gazoilPrice,
      dieselPrice
    });

    const savedStation = await newStation.save();
    res.status(201).json(savedStation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Nearby stations using lat/lng
router.get('/', async (req, res) => {
  const { lat, lng, sortBy } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: 'Latitude and Longitude are required' });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: 'Invalid latitude or longitude' });
  }

  const sortField = sortBy === 'distance' ? 'distance' : 'gazoilPrice';

  try {
    const stations = await Station.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [longitude, latitude] },
          distanceField: 'distance',
          spherical: true,
          maxDistance: 10000000, // adjust if needed
        }
      },
      {
        $sort: { [sortField]: 1 }
      }
    ]);

    if (!stations.length) {
      return res.status(404).json({ message: 'No stations found near this location' });
    }

    res.json(stations);
  } catch (error) {
    console.error('GeoNear error:', error);
    res.status(500).json({ message: error.message || 'Geo query failed' });
  }
});



// ✅ NEW: GET - All stations without filtering (e.g., for admin panel)
router.get('/all', async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
