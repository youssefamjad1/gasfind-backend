import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

const router = express.Router();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

console.log('Admin password loaded:', ADMIN_PASSWORD); // Log to ensure it's loaded correctly
console.log('JWT Secret loaded:', JWT_SECRET); // Log JWT secret

// Admin login route
router.post('/login', (req, res) => {
  const { password } = req.body;
  console.log('Received password:', password); // Log the received password for debugging purposes

  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated token:', token); // Log the generated token for debugging purposes
    return res.json({ token });
  }
  return res.status(401).json({ message: 'Unauthorized: Invalid password' }); // Clear error message
});

// Token verification route
router.post('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    jwt.verify(token, JWT_SECRET); // Verify the token using the secret
    return res.sendStatus(200); // Return success status if the token is valid
  } catch (err) {
    console.error('Token verification failed:', err.message); // Log the error for debugging
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' }); // Clear error message
  }
});

export default router;
