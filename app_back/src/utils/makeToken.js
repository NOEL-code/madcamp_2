const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

exports.makeAccessToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    return token;
}

exports.makeRefreshToken = () => {
    const refreshToken = jwt.sign({}, process.env.JWT_SECRET, {expiresIn: "14d"});
    return refreshToken;
}
