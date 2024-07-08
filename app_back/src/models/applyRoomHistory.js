const mongoose = require("mongoose");

const applyRoomHistorySchema = mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        // 승락대기: 1, 승락: 2, 거절: 3, 신청자 취소: 4
        type: Number,
        default: 1,
      },
    },
  ],
});

const applyRoomHistory = mongoose.model(
  "applyRoomHistory",
  applyRoomHistorySchema
);

module.exports = { applyRoomHistory };
