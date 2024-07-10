const express = require("express");
const {
  getAttendance,
  recordArrival,
  recordLeave,
  recordGoOut,
  recordComeBack,
  getAttendanceByDate,
  getCurrentStatus,
  updateStatus, // 새로 추가된 함수
  getTopWorker
} = require("../controllers/attendanceController");
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.get("/", authenticateToken, getAttendance); // 본인의 전체 출결 리스트 받기
router.post("/arrival/:userId", recordArrival); // 출근 기록
router.post("/leave/:userId", recordLeave); // 퇴근 기록
router.post("/goout/:userId", recordGoOut); // 외출 기록
router.post("/comeback/:userId", recordComeBack); // 복귀 기록
router.get("/:date", authenticateToken, getAttendanceByDate); // 특정 날짜의 출결 기록 받기
router.get("/status/:userId", authenticateToken, getCurrentStatus); // 팀원의 현재 상태 받기
router.post("/status/:userId", authenticateToken, updateStatus); // 팀원의 상태 업데이트


module.exports = router;
