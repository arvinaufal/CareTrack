const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const secretKeyEncrypt = process.env.SECRET_KEY_ENCRYPT;

const createToken = (req) => {
    const token = jwt.sign(req, secretKey);
    return token;
}

const verifyToken = (req) => {
    const decoded = jwt.verify(req, secretKey);
    return decoded;
}

const encryptData = (req) => {
    const token = jwt.sign(req, secretKeyEncrypt);
    return token;
}
const decryptData = (req) => {
    const decoded = jwt.verify(req, secretKeyEncrypt);
    console.log(decoded, 'decoded');
    return decoded;
}

module.exports = { createToken, verifyToken, encryptData, decryptData };