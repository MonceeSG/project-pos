const { verifyToken } = require('../utils/jwt');

const authentication = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const payload = verifyToken(token);
        if (!payload) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = payload;
        next();

    } catch (error) {
        console.error("Authentication error: ",error);
        res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = authentication;