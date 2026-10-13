const express = require('express');
const Listing = require('../models/Listing');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();
// 🛡️ THE IRON STOMACH: Strict payload validation middleware
const validateListingPayload = (req, res, next) => {
  const { title, company, location, salary, description } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 3 || title.length > 100) {
    return res.status(400).json({ message: "Invalid Title: Must be a text string between 3 and 100 characters." });
  }
  if (!company || typeof company !== 'string' || company.trim().length < 2 || company.length > 100) {
    return res.status(400).json({ message: "Invalid Organization: Must be between 2 and 100 characters." });
  }
  if (!location || typeof location !== 'string' || location.trim().length < 2 || location.length > 100) {
    return res.status(400).json({ message: "Invalid Location: Must be clearly specified." });
  }
  if (!salary || typeof salary !== 'string' || salary.trim().length < 2 || salary.length > 50) {
    return res.status(400).json({ message: "Invalid Stipend/Salary format." });
  }
  if (!description || typeof description !== 'string' || description.trim().length < 10 || description.length > 3000) {
    return res.status(400).json({ message: "Invalid Specification: Description must be between 10 and 3,000 characters." });
  }

  next(); // Payload looks pristine. Pass it to the Mongoose surgeon.
};
// 1. GET ALL JOBS (Public - Grads and Recruiters can both view the board)
router.get('/', async (req, res) => {
  try {
    // .populate() automatically swaps the recruiter's ID for their actual Name and Email!
    const listings = await Listing.find().populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (err) {
    console.error('GET /listings failed:', err);
    res.status(500).json({ message: 'Failed to load listings' });
  }
});

// 2. POST A JOB (Protected - STRICTLY RECRUITERS ONLY)
router.post('/', verifyToken, validateListingPayload, async (req, res) => {
  try {
    // THE RBAC CHECK:
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Access Denied: Grads are not authorized to post jobs.' });
    }

    const { title, company, location, salary, description } = req.body;

    const newJob = new Listing({
      title,
      company,
      location,
      salary,
      description,
      postedBy: req.user.userId // Plucked straight out of the verified JWT!
    });

    await newJob.save();
    res.status(201).json({ message: 'Job successfully posted to the board!', job: newJob });

  } catch (err) {
    res.status(500).json({ message: 'Failed to post job' });
  }
});

module.exports = router;