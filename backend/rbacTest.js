// Look at the message you just sent me. Copy Sarah's long token sitting inside the single quotes, 
// and paste it right here between these quotes:
const SARAH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTNhYjA3ZDRhY2RhNzVmZDdkZjRmNTYiLCJyb2xlIjoiZ3JhZCIsImlhdCI6MTc4MjIzMTc3MSwiZXhwIjoxNzgyMzE4MTcxfQ.NO7gryTh2XkR19DEG9oSKGo4CYH7yU2LsiC28c6t6h4";

fetch('http://localhost:5000/api/listings', {
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