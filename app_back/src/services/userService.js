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
  let user = await User.findOne({ userEmail });
  if (user) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userPassword, salt);

  user = new User({
    userEmail,
    userPassword: hashedPassword,
    name,
    phoneNumber,
    photoUrl,
  });

  await user.save();

  const payload = {
    user: {
      id: user.id,
    },
  };

  const accessToken = makeAccessToken(payload);
  const refreshToken = makeRefreshToken(payload);

  await TokenModel.updateRefresh({
    user_id: user.id,
    refreshToken,
  });

  return { accessToken, refreshToken };
};

exports.loginUser = async ({ userEmail, userPassword }) => {
  let user = await User.findOne({ userEmail });
  console.log(user);
  if (!user) {
    console.log("여기서 .. ", userEmail); // userEmail은 잘 전달됨 ..
    throw new Error("가입된 id가 아님");
  }

  const isMatch = await bcrypt.compare(userPassword, user.userPassword);
  if (!isMatch) {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }

  const payload = {
    user: {
      id: user.id,
    },
  };
  console.log("Received login request:", userEmail, userPassword);

  const accessToken = makeAccessToken(payload);
  const refreshToken = makeRefreshToken(payload);

  await TokenModel.updateRefresh({
    user_id: user.id,
    refreshToken,
  });

  return { accessToken, refreshToken };
};

exports.refreshAccessToken = async (refreshToken) => {
  try {

    console.log("리프레시 토큰 검증 시작:", refreshToken);
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log("리프레시 토큰 디코딩 완료:", decoded);

    const userToken = await TokenModel.findToken(decoded.user.id);
    console.log("데이터베이스에서 찾은 토큰:", userToken);

    if (!userToken || userToken.refreshToken !== refreshToken) {
      throw new Error("유효하지 않은 리프레시 토큰");
    }

    const payload = {
      user: {
        id: decoded.user.id,
      },
    };

    const newAccessToken = makeAccessToken(payload);
    console.log("새로운 액세스 토큰 생성 완료:", newAccessToken);
    return { accessToken: newAccessToken };
  } catch (error) {
    console.error("토큰 갱신 중 오류 발생:", error.message);
    throw new Error("유효하지 않은 리프레시 토큰");
  }
};

exports.getUsers = async () => {
  let users = await User.find();
  if (!users || users.length === 0) {
    throw new Error("There are no users");
  }

  const resUsers = users.map((user) => ({
    id: user._id,
    userName: user.name,
  }));

  return resUsers;
};

exports.updateProfileImage = async (userId, imageUrl) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    console.log(
      "Updating profile image for userId:",
      userId,
      "with imageUrl:",
      imageUrl
    );

    const user = await User.findByIdAndUpdate(
      mongoose.Types.ObjectId(userId),
      { photoUrl: imageUrl },
      { new: true }
    );

    if (!user) {
      console.error("User not found for userId:", userId);
      return null;
    }

    console.log("Updated user:", user);
    return user.photoUrl;
  } catch (err) {
    console.error("Error in updateProfileImage:", err);
    throw new Error("Error updating profile image");
  }
};

exports.getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-userPassword"); // 비밀번호 제외
  if (!user) {
    throw new Error("User not found");
  }
  return {
    id: user._id,
    userName: user.name,
    userEmail: user.userEmail,
    phoneNumber: user.phoneNumber,
    photoUrl: user.photoUrl,
  };
};

exports.logoutUser = async (userId) => {
  await TokenModel.deleteToken(userId);
};
