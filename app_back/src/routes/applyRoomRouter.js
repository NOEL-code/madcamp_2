const express = require("express");
const {
  applyRoom,
  acceptApplication,
  rejectApplication,
  getAppliedMember,
} = require("../controllers/applyRoomController");

const router = express.Router();

router.post("/apply", applyRoom); // 참가 신청
router.put("/accept/:roomId/:userId", acceptApplication); // 신청 승락
router.put("/reject/:roomId/:userId", rejectApplication); // 신청 거절
router.get("/:roomId", getAppliedMember); // 신청한 인원 보기

module.exports = router;
