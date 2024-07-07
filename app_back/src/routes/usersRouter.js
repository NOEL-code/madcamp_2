const { registerUser, getUsers } = require("../controllers/userController");
const upload = require("../utils/s3");
const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getCurrentUser,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken); // 리프레시 토큰 엔드포인트
router.get("/me", authenticateToken, getCurrentUser);
router.get("/logout", authenticateToken, logoutUser);

router.post("/create/image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = req.file.location; // S3에 저장된 이미지의 URL
  res.status(200).json({ imageUrl });
});

router.put("/update/image", upload.single("image"), updateImage);

module.exports = router;
