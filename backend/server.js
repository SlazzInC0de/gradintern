const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// Middleware
app.use(express.json()); 
app.use(cors());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings')); // <-- ADD THIS LINE

const PORT = process.env.PORT || 5000;

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 MongoDB Atlas Connected Successfully'))
  .catch((err) => console.log('🔴 MongoDB Connection Error: ', err));

// Standard sanity check route
app.get('/', (req, res) => {
  res.send('GradIntern API is awake.');
});

app.listen(PORT, () => console.log(`🚀 Server spinning on port ${PORT}`));