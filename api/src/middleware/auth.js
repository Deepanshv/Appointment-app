const jwt = require("jsonwebtoken");
const { UserRole } = require("@prisma/client");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

  if (token == null) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden (invalid token)
    req.user = user;
    next();
  });
};

const authorizeRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res
      .status(403)
      .json({
        error: { code: "FORBIDDEN", message: "Insufficient permissions." },
      });
  }
  next();
};

module.exports = { authenticateToken, authorizeRole, UserRole };
