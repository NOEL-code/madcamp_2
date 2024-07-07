const { registerUser } = require("../services/userService");
const { loginUser } = require("../services/userService");
const { getUsers } = require("../services/userService");
const { refreshAccessToken } = require('../services/userService');
const { getCurrentUser } = require('../services/userService');
const { logoutUser } = require('../services/userService');

exports.registerUser = async (req, res) => {
  const { userEmail, userPassword, name, phoneNumber, photoUrl } = req.body;

  try {
    const token = await registerUser({
      userEmail,
      userPassword,
      name,
      phoneNumber,
      photoUrl,
    });
    res.status(201).json({ token });
  } catch (err) {
    if (err.message === "User already exists") {
      return res.status(400).json({ message: err.message });
    }
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 로그인
exports.loginUser = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  try {
    const {accessToken, refreshToken} = await loginUser({
      userEmail,
      userPassword,
    });
    res.status(201).json({accessToken, refreshToken} );
  } catch (err) {
    if (err.message === "가입된 id가 아님" || err.message === "비밀번호가 일치하지 않습니다.") {
      return res.status(400).json({ message: err.message });
    }
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    await logoutUser(req.user.id);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "리프레시 토큰이 필요합니다." });
  }

  try {
    const { accessToken } = await refreshAccessToken(refreshToken);
    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

// 여기부터
exports.getUsers = async (req, res) => {
  try {
    const users = await getUsers();
    // 여기 있느 200은 정해져있는 오류 코드임. 404는 페이직 ㅏㅇ벗다건 ㅏ.. 요런거 
    // 응답을 json으로 줄거고 그 안에 users라는 객체를 넣어줄겅.ㅁ 
    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    console.log("Current user ID:", req.user.id);
    const user = await getCurrentUser(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    console.log("Error fetching current user:", err.message);
    res.status(500).json({ message: err.message });
  }
};