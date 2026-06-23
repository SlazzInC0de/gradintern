const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['grad', 'recruiter'], // This rejects any user who isn't strictly one of these two
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);