const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    console.log("No token provided");
    return res.sendStatus(401); // 토큰이 없는 경우 401 반환
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification failed", err);
      return res.sendStatus(403); // 토큰이 유효하지 않은 경우 403 반환
    }
    console.log("Token verified successfully", user);
    req.user = user.user; // 여기서 user.user로 설정
    next();
  });
};

module.exports = authenticateToken;
