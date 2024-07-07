const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { makeAccessToken, makeRefreshToken } = require("../utils/makeToken");
const TokenModel = require("../services/tokenService");

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


exports.loginUser = async ({
  userEmail,
  userPassword,
}) => {
  // 이메일 중복 체크
  let user = await User.findOne({ userEmail });
  // 비밀번호 해싱
  const isMatch = await bcrypt.compare(userPassword, user.userPassword);

  if (!isMatch) {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }

  const payload = {
    user: {
      id: user.id,
    },
  };

  // accessToken 과 refreshToken 발급하기
  const accessToken = makeAccessToken(payload);
  const refreshToken = makeRefreshToken();

  await TokenModel.updateRefresh({
    _id: user.id,
    refreshToken
  })
  
  return {accessToken, refreshToken};
};



exports.getUsers = async () => {
  // users에 있는 모든 데이터를 가져와라
  let users = await User.find();
  //없으면 에러
  if (!users || users.length === 0) {
    throw new Error("There are no users");
  }
  // dto. 가져온 객체를 편집해서 id랑 userName만 가져온다. 편집을 해서 반환해준ㄴ다
  const resUsers = users.map((user) => ({
    id: user._id,
    userName: user.name,
  }));

  return resUsers;
};
