const express = require("express");
const {
  getInvitedRooms,
  acceptInvite,
  rejectInvite,
  sendInvite,
} = require("../controllers/invitedRoomController");

const router = express.Router();

router.get("/:userId", getInvitedRooms); // 초대 목록 받기
router.post("/send", sendInvite); // 초대 보내기
router.put("/accept/:userId/:roomId", acceptInvite); // 초대 수락하기
router.put("/reject/:userId/:roomId", rejectInvite); // 초대 거절하기

module.exports = router;
