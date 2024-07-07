const express = require("express");
const {
  registerUser,
  getUsers,
  updateProfileImage,
} = require("../controllers/userController");
const upload = require("../utils/s3");

const router = express.Router();

// 회원가입 라우트
router.post("/register", registerUser);

router.get("/", getUsers);

router.post("/create/image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = req.file.location; // S3에 저장된 이미지의 URL
  res.status(200).json({ imageUrl });
});

router.put("/update/image", upload.single("image"), updateImage);

module.exports = router;
