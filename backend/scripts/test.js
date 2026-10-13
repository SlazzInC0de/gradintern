fetch(`${process.env.API_URL || 'http://localhost:5005'}/api/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Sarah Jenkins",
    email: "sarah.j@university.edu",
    password: "SuperSecretPassword123",
    role: "grad"
  })
})
.then(res => res.json())
.then(data => console.log("SERVER ANSWERED:", data))
.catch(err => console.error(err));