const { registerUser, getUsers } = require("../controllers/userController");
const upload = require("../utils/s3");
const express = require("express");
const {
  loginUser,
  logoutUser,
  refreshToken,
  getCurrentUser,
  updateImage,
  getUserById,
  createImage,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.get("/", getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken); // 리프레시 토큰 엔드포인트
router.get("/me", authenticateToken, getCurrentUser);
router.get("/logout", authenticateToken, logoutUser);

router.post("/update/image", upload.single("image"), updateImage);
// 회원가입 할 때 플필 사진 정하기
router.post("/create/image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = req.file.location; // S3에 저장된 이미지의 URL
  res.status(200).json({ imageUrl });
});

module.exports = router;
