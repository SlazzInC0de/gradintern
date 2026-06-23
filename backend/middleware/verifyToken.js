const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied. Show your VIP wristband.' });
  }

  // The header looks like: "Bearer eyJhbGciOiJIUzI1Ni..."
  // We split at the space to grab just the token part
  const token = authHeader.split(' ')[1]; 

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Slaps the decoded payload { userId, role } onto the request
    next(); // "Go right on through, sir."
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired VIP wristband.' });
  }
};

module.exports = verifyToken;