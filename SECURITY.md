# Security Policy

## Supported versions

Only the latest commit on the `main` branch receives security fixes.

## Reporting a vulnerability

Please do not open a public issue for security problems.

Report it privately by either:

- using **Report a vulnerability** under this repository's **Security** tab, or
- emailing **vsuryansh080405@gmail.com** with the subject `[GradIntern] Security report`.

Include:

- what the issue is and where it lives (endpoint, page, file)
- steps or a minimal request that reproduces it
- the impact you expect (for example, a grad posting a job, or reading another user's data)

## What to expect

- An acknowledgement within 7 days.
- A fix or a clear decision within 30 days for confirmed issues, depending on severity.
- Credit in the fix commit if you would like it.

## Scope

In scope:

- authentication and JWT handling (`backend/routes/auth.js`, `backend/middleware/verifyToken.js`)
- role-based access control bypasses on any `/api` route
- NoSQL injection or payload validation bypasses
- exposure of password hashes, tokens or other users' details
- XSS in the React frontend, including through job listing content
- CORS misconfiguration and vulnerable dependencies

Out of scope: the known trade-offs listed in the README (for example, a JWT cannot be revoked before its 1-day expiry), and reports from automated scanners without a working proof of concept.

## Notes for self-hosting

- Keep `MONGO_URI` and `JWT_SECRET` in `backend/.env` only. Never commit them.
- Generate `JWT_SECRET` with the command in `backend/.env.example` and rotate it if it leaks.
- Set `CLIENT_URL` to your real frontend origin.
