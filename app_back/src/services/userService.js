const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

exports.registerUser = async ({
  userEmail,
  userPassword,
  name,
  phoneNumber,
  photoUrl,
}) => {
  // 이메일 중복 체크
  let user = await User.findOne({ userEmail });
  if (user) {
    throw new Error("User already exists");
  }

  // 비밀번호 해싱
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userPassword, salt);

  // 새로운 사용자 생성
  user = new User({
    userEmail,
    userPassword: hashedPassword,
    name,
    phoneNumber,
    photoUrl,
  });

  // 사용자 저장
  await user.save();

  // JWT 토큰 생성
  const payload = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  return token;
};
