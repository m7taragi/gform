const jwt = require('jsonwebtoken');

// 1. Verify if the user is authenticated at all
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data (id, role) to the request object
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid configuration token." });
    }
};

// 2. Restrict endpoint strictly to specific roles (Open for extension)
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden. Insufficient permissions." });
        }
        next();
    };
};

module.exports = { protect, authorizeRoles };
