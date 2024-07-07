const express = require("express");
const {
  getRooms,
  getUserRooms,
  getHostRooms,
  createRoom,
  addMembersToRoom,
  removeMemberFromRoom,
  updateRoomDescription,
  deleteRoomById,
} = require("../controllers/roomController");

const router = express.Router();

router.get("/", getRooms); // 전체 방 리스트 받기

router.get("/user/:userId", getUserRooms); // 멤버 id로 소속되어 있는 방 리스트 받기

router.get("/host/:hostId", getHostRooms); // 호스트 id로 방 리스트 받기

router.post("/create", createRoom); // 방 생성

router.post("/:roomId/members", addMembersToRoom); // 멤버 추가 (개발 테스트용, 서비스는 실제 사용 예정)

router.delete("/:roomId/member/:memberId", removeMemberFromRoom); // 멤버 삭제 라우트

router.put("/:roomId", updateRoomDescription); //방 제목 업데이트

router.delete("/:roomId", deleteRoomById); // 방 삭제

module.exports = router;
