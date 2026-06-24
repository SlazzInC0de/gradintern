require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Route Imports
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');

const app = express();

// ====================================================================
// 🛡️ THE CORS VELVET ROPE: Authorize React to knock on our TCP port
// ====================================================================
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Mount the Routers
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);

// Root Health-Check (For Vercel / Render deployment)
app.get('/', (req, res) => {
  res.status(200).json({ status: "🟢 Cluster API v1.0 Operational" });
});

// Mongoose Handshake
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 MongoDB Atlas Connected Successfully'))
  .catch((err) => console.error('🚨 Atlas Connection Failure:', err));

// Port allocation (Locked strictly to 5005 to bypass Windows OS ghosts)
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`🚀 Server spinning on port ${PORT}`);
});