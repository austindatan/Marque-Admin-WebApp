const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided or invalid format.' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const secretKey = process.env.JWT_SECRET || "defaultsecret";
        
        // Verify token
        const decoded = jwt.verify(token, secretKey);
        
        req.user = { 
            id: decoded.id, 
            role: decoded.role 
        }; 
        
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.name, err.message);
        res.status(401).json({ message: 'Token is invalid or expired. Please log in again.' });
    }
};

module.exports = authMiddleware;
