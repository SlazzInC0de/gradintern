fetch(`${process.env.API_URL || 'http://localhost:5005'}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: "sarah.j@university.edu",
    password: "SuperSecretPassword123" // The raw password, NOT the hash
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));