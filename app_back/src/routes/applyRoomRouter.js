const express = require("express");
const {
  applyRoom,
  acceptApplication,
  rejectApplication,
  // getAppliedMember,
  getApply,
  getAppliedRoomByUserId,
  cancelApplication,
  getWaitingUsersByRoomId
} = require("../controllers/applyRoomController");

const router = express.Router();

router.get("/", getApply);
router.post("/", applyRoom); // 참가 신청
router.put("/accept/:roomId/:userId", acceptApplication); // 신청 승락
router.put("/reject/:roomId/:userId", rejectApplication); // 신청 거절
router.put("/cancel/:roomId/:userId", cancelApplication); // 신청 취하
// router.get("/:roomId", getAppliedMember); // 신청한 인원 보기
router.get("/user/:userId", getAppliedRoomByUserId);
router.get("/waiting/:roomId", getWaitingUsersByRoomId);  // 이 방에 신청한 인원 찾기

module.exports = router;
