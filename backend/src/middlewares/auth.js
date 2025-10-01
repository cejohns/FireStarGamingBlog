const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
}

function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) return res.status(403).json({ error: "Access forbidden" });
        next();
    };
}

module.exports = { authenticateToken, authorizeRole };
