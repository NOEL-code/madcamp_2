const jwt = require("jsonwebtoken");

exports.makeAccessToken = (payload) => {
  console.log("액세스 토큰 생성 시작:", payload);
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  console.log("액세스 토큰 생성 완료:", token);
  return token;
};

exports.makeRefreshToken = (payload) => {
  console.log("리프레시 토큰 생성 시작:", payload);
<<<<<<< HEAD
  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
=======
  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
>>>>>>> parent of 5cfeb04 (Remove cached files)
  console.log("리프레시 토큰 생성 완료:", token);
  return token;
};
