const express = require('express');
const { registerUser, loginUser, getUsers, refreshToken, getCurrentUser } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken); // 리프레시 토큰 엔드포인트
router.get('/me', authenticateToken, getCurrentUser);



module.exports = router;
