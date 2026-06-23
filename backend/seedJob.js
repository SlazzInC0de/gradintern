async function runRecruiterTest() {
  console.log("1. Registering Richard Hendricks (Recruiter)...");
  await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: "Richard Hendricks",
      email: "richard@piedpiper.com",
      password: "PiedPiperTabsOverSpaces1",
      role: "recruiter"
    })
  });

  console.log("2. Logging Richard in to get his VIP Wristband...");
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: "richard@piedpiper.com",
      password: "PiedPiperTabsOverSpaces1"
    })
  });
  const loginData = await loginRes.json();
  const recruiterToken = loginData.token;

  console.log("3. Holding up Richard's token to post a job...");
  const jobRes = await fetch('http://localhost:5000/api/listings', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${recruiterToken}`
    },
    body: JSON.stringify({
      title: "Junior React.js Frontend Engineer",
      company: "Pied Piper",
      location: "Palo Alto, CA (Hybrid)",
      salary: "$85,000 - $105,000",
      description: "Looking for a hungry graduate who understands Context API, loves clean code, and strictly uses tabs instead of spaces."
    })
  });
  
  const jobData = await jobRes.json();
  console.log("\n🎉 THE MARKETPLACE SAYS:", jobData);
}

runRecruiterTest();