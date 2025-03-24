const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
    const authHeader = req.headers.authorization;

    const token = authHeader?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. Please login." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("❌ Token verification failed:", err.message); // ✅ Debugging
            return res.status(401).json({ success: false, message: "Invalid or expired token." });
        }
        req.user = decoded;
        next();
    });
};

module.exports = authentication;
