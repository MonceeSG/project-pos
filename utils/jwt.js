const jwt = require('jsonwebtoken');
const generateToken = (payload) => {
    return jwt.sign(payload,"Rahasia", { expiresIn: '1h' });
}

const verifyToken = (token) => {
    return jwt.verify(token, "Rahasia");
}

module.exports = {
    generateToken,
    verifyToken
};