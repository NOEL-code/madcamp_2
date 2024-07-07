const express = require("express");
const {
    getAttendance,
    createAttendance,
    recordArrival,
    recordDeparture,
    recordLeave,
    recordComeBack
} = require("../controllers/attendanceController");
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.get("/", authenticateToken, getAttendance); // 본인의 전체 출결 리스트 받기
router.post("/create", authenticateToken, createAttendance);
router.post("/arrival", authenticateToken, recordArrival); // 출근 기록
router.post("/departure", authenticateToken, recordDeparture); // 퇴근 기록
router.post("/leave", authenticateToken, recordLeave); // 외출 기록
router.post("/comeback", authenticateToken, recordComeBack); // 복귀 기록

module.exports = router;
