const express = require('express');
const Listing = require('../models/Listing');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// 1. GET ALL JOBS (Public - Grads and Recruiters can both view the board)
router.get('/', async (req, res) => {
  try {
    // .populate() automatically swaps the recruiter's ID for their actual Name and Email!
    const listings = await Listing.find().populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch job board' });
  }
});

// 2. POST A JOB (Protected - STRICTLY RECRUITERS ONLY)
router.post('/', verifyToken, async (req, res) => {
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