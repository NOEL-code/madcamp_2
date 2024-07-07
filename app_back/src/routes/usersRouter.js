<<<<<<< HEAD
const { getUsers } = require("../controllers/userController");
=======
const { registerUser, getUsers } = require("../controllers/userController");
>>>>>>> parent of 5cfeb04 (Remove cached files)
const upload = require("../utils/s3");
const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getCurrentUser,
<<<<<<< HEAD
  updateImage,
=======
>>>>>>> parent of 5cfeb04 (Remove cached files)
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

<<<<<<< HEAD
router.get("/", getUsers);
=======
>>>>>>> parent of 5cfeb04 (Remove cached files)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken); // 리프레시 토큰 엔드포인트
router.get("/me", authenticateToken, getCurrentUser);
router.get("/logout", authenticateToken, logoutUser);
<<<<<<< HEAD
router.post("/update/image", upload.single("image"), updateImage);
=======

router.post("/create/image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = req.file.location; // S3에 저장된 이미지의 URL
  res.status(200).json({ imageUrl });
});

router.put("/update/image", upload.single("image"), updateImage);
>>>>>>> parent of 5cfeb04 (Remove cached files)

module.exports = router;
