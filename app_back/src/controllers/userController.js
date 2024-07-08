const {
  registerUser,
  getUsers,
  updateProfileImage,
  loginUser,
  refreshAccessToken,
  getCurrentUser,
  logoutUser,
  getUserById,
} = require("../services/userService");

exports.registerUser = async (req, res) => {
  console.log('registerUser called with body:', req.body);
  const { userEmail, userPassword, name, phoneNumber, photoUrl } = req.body;

  try {
    const { accessToken, refreshToken } = await registerUser({
      userEmail,
      userPassword,
      name,
      phoneNumber,
      photoUrl,
    });
    console.log('registerUser successful:', { accessToken, refreshToken });
    res.status(201).json({ accessToken, refreshToken });
  } catch (err) {
    if (err.message === "User already exists") {
      console.error('registerUser error: User already exists');
      return res.status(400).json({ message: err.message });
    }
    console.error('registerUser error:', err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 로그인
exports.loginUser = async (req, res) => {
  console.log('loginUser called with body:', req.body);
  const { userEmail, userPassword } = req.body;

  try {
    const { accessToken, refreshToken, resUser } = await loginUser({
      userEmail,
      userPassword,
    });
    console.log('loginUser successful:', { accessToken, refreshToken, resUser });
    res.status(201).json({ accessToken, refreshToken, resUser });
  } catch (err) {
    if (
      err.message === "가입된 id가 아님" ||
      err.message === "비밀번호가 일치하지 않습니다."
    ) {
      console.error('loginUser error:', err.message);
      return res.status(400).json({ message: err.message });
    }
    console.error('loginUser error:', err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logoutUser = async (req, res) => {
  console.log('logoutUser called with user id:', req.user.id);
  try {
    await logoutUser(req.user.id);
    console.log('logoutUser successful');
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error('logoutUser error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  console.log('refreshToken called with body:', req.body);
  const { refreshToken } = req.body;

  if (!refreshToken) {
    console.error('refreshToken error: 리프레시 토큰이 필요합니다.');
    return res.status(401).json({ message: "리프레시 토큰이 필요합니다." });
  }

  try {
    const { accessToken } = await refreshAccessToken(refreshToken);
    console.log('refreshToken successful, new accessToken:', accessToken);
    res.status(200).json({ accessToken });
  } catch (err) {
    console.error('refreshToken error:', err.message);
    res.status(403).json({ message: err.message });
  }
};

exports.updateImage = async (req, res) => {
  console.log('updateImage called with file:', req.file);
  if (!req.file) {
    console.error('updateImage error: No file uploaded');
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { userId } = req.body;
  const imageUrl = req.file.location; // S3에 저장된 이미지의 URL

  try {
    console.log("Updating image for user:", userId);
    const resImageUrl = await updateProfileImage(userId, imageUrl);
    if (!resImageUrl) {
      console.error('updateImage error: User not found');
      return res.status(404).json({ message: "User not found" });
    }
    console.log('updateImage successful, new imageUrl:', resImageUrl);
    res.status(200).json({ imageUrl: resImageUrl });
  } catch (err) {
    console.error("Error updating profile image:", err);
    res.status(500).json({ message: "Error updating profile image" });
  }
};

exports.createImage = async (req, res) => {
  console.log('createImage called with file:', req.file);
  if (!req.file) {
    console.error('createImage error: No file uploaded');
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const imageUrl = await createImage(req.file);
    console.log('createImage successful, imageUrl:', imageUrl);
    res.status(200).json({ imageUrl });
  } catch (err) {
    console.error("Error creating profile image:", err);
    res.status(500).json({ message: "Error creating profile image" });
  }
};

exports.getUsers = async (req, res) => {
  console.log('getUsers called');
  try {
    const users = await getUsers();
    console.log('getUsers successful, users:', users);
    res.status(200).json(users);
  } catch (err) {
    console.error('getUsers error:', err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;
  console.log('getUserById called with userId:', userId);

  try {
    const user = await getUserById(userId);
    if (user) {
      console.log('getUserById successful, user:', user);
      res.status(200).json(user);
    } else {
      console.error('getUserById error: User not found');
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error('getUserById error:', err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCurrentUser = async (req, res) => {
  console.log('getCurrentUser called with user id:', req.user.id);
  try {
    const user = await getCurrentUser(req.user.id);
    console.log('getCurrentUser successful, user:', user);
    if (user) {
      res.status(200).json(user);
    } else {
      console.error('getCurrentUser error: User not found');
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error('getCurrentUser error:', err.message);
    res.status(500).json({ message: "Server error" });
  }
};
