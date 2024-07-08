const express = require("express");
const {
    getAttendance,
    recordArrival,
    recordLeave,
    recordGoOut,
    recordComeBack,
    getAttendanceByDate
} = require("../controllers/attendanceController");
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.get("/", authenticateToken, getAttendance); // 본인의 전체 출결 리스트 받기
router.post("/arrival", authenticateToken, recordArrival); // 출근 기록
router.post("/leave", authenticateToken, recordLeave); // 퇴근 기록
router.post("/goout", authenticateToken, recordGoOut); // 외출 기록
router.post("/comeback", authenticateToken, recordComeBack); // 복귀 기록
router.get("/:date", authenticateToken, getAttendanceByDate); // 특정 날짜의 출결 기록 받기

module.exports = router;