const express = require("express");
const { registerUser, getUsers, loginUser } = require("../controllers/userController");

const router = express.Router();

// 회원가입 라우트
router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/", getUsers);

module.exports = router;
