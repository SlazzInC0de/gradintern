// Expects a grad user's JWT in GRAD_TOKEN; a 403 response proves RBAC blocks grads from posting.
const SARAH_TOKEN = process.env.GRAD_TOKEN; // JWT of a "grad" user from loginTest.js

fetch(`${process.env.API_URL || 'http://localhost:5005'}/api/listings`, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SARAH_TOKEN}`
  },
  body: JSON.stringify({
    title: "Senior Vice President of Engineering",
    company: "Google",
    location: "Mountain View, CA",
    salary: "$350,000",
    description: "Sarah is trying to hire herself into Google."
  })
})
.then(res => res.json())
.then(data => console.log("THE BOUNCER SAYS:", data))
.catch(err => console.error(err));