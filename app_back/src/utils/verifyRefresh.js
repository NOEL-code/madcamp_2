const jwt = require('jsonwebtoken');
const { TokenModel } = require('../services/tokenService');
const { makeAccessToken } = require('../utils/makeToken');

// 리프레시 토큰을 검증하고 새로운 액세스 토큰을 발급하는 함수
const verifyRefresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "리프레시 토큰이 필요합니다." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userToken = await TokenModel.findToken(decoded.user.id);

    if (!userToken || userToken.refreshToken !== refreshToken) {
      throw new Error("유효하지 않은 리프레시 토큰");
    }

    const payload = {
      user: {
        id: decoded.user.id,
      },
    };

    const newAccessToken = makeAccessToken(payload);
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "유효하지 않은 리프레시 토큰" });
  }
};

module.exports = verifyRefresh;
