const jwt = require("jsonwebtoken");
require("dotenv").config();

const protect = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // Store user ID in request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "No User" });
  }
  if (req.user.isAdmin) {
    next(); // User is admin, proceed to the next middleware
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };
