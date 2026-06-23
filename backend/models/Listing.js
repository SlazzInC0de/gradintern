const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String }, // e.g. "$65,000 - $80,000"
  description: { type: String, required: true },
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // This tells Mongo: "The ID stored here belongs to a human in the Users collection"
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Listing', ListingSchema);