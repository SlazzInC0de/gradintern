require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/Listing');
const User = require('./models/user'); // <-- Imported your User model!

const seedData = [
  {
    title: "Core AI Systems Intern",
    company: "Google Cloud Labs",
    location: "Bengaluru, KA (Hybrid)",
    salary: "₹75,000 / month",
    type: "Internship",
    description: "Work on distributed tensor-processing pipelines. Must be comfortable with Python, C++, and basic CUDA memory management."
  },
  {
    title: "Frontend Architecture Trainee",
    company: "Razorpay",
    location: "Bengaluru, KA (On-site)",
    salary: "₹55,000 / month",
    type: "Internship",
    description: "Optimizing the checkout SDK to load under 1.2 seconds on 3G mobile networks. Deep React profiling skills required."
  },
  {
    title: "Backend Go/Postgres Intern",
    company: "Zerodha Tech",
    location: "Remote (India)",
    salary: "₹80,000 / month",
    type: "Internship",
    description: "Writing high-throughput order matching microservices in Golang. Zero-allocation programming mindset is a must."
  },
  {
    title: "Developer Relations & API Intern",
    company: "Postman",
    location: "Bengaluru, KA (Hybrid)",
    salary: "₹45,000 / month",
    type: "Internship",
    description: "Creating public collection templates and benchmarking WebSocket response latencies for the v11 desktop client."
  },
  {
    title: "Cloud Infrastructure Intern",
    company: "Microsoft Azure",
    location: "Hyderabad, TS (On-site)",
    salary: "₹70,000 / month",
    type: "Internship",
    description: "Assisting the Linux Kernel team with eBPF network packet tracing inside Azure virtualized containers."
  },
  {
    title: "Full Stack Next.js Intern",
    company: "CRED",
    location: "Bengaluru, KA (On-site)",
    salary: "₹65,000 / month",
    type: "Internship",
    description: "Crafting hyper-fluid, 60fps canvas animations and connecting them to stateless Redis session stores."
  }
];

async function plantSeeds() {
  try {
    console.log("🔌 Initializing Mongoose connection to Atlas Cluster...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 Atlas Handshake confirmed.");

    // 1. LOOK FOR A RECRUITER TO OWN THESE JOBS
    let masterRecruiter = await User.findOne({ role: 'recruiter' });

    // If the database has 0 recruiters, spawn an emergency System Bot to own them:
    if (!masterRecruiter) {
      console.log("⚠️ No Recruiters found in DB. Spawning 'Atlas System Bot'...");
      masterRecruiter = await User.create({
        name: "Atlas System Bot",
        email: "system@gradintern.internal",
        password: "hashed_dummy_password_999",
        role: "recruiter"
      });
    }

    console.log(`👤 Stamping jobs with Recruiter Owner ID: [${masterRecruiter._id}]`);

    // 2. STAMP THE ID ONTO ALL 6 JOBS
    const legitimateListings = seedData.map(job => ({
      ...job,
      postedBy: masterRecruiter._id // <-- THE MISSING PASSPORT
    }));

    await Listing.deleteMany({});
    console.log("🧹 Purged old ghost listings...");

    await Listing.insertMany(legitimateListings);
    console.log(`🌱 VICTORY: ${legitimateListings.length} Tier-1 Enterprise listings injected successfully!`);

    process.exit(0);
  } catch (err) {
    console.error("🚨 Seeder injection failed:", err);
    process.exit(1);
  }
}

plantSeeds();