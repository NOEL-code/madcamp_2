const mongoose = require("mongoose");

const InvitedRoomHistorySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rooms: [
    {
      RoomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
      status: {
        // 1은 수락 대기, 2는 수락, 3은 거절
        type: Number,
        default: 1,
      },
    },
  ],
});

const InvitedRoomHistory = mongoose.model(
  "InvitedRoomHistory",
  InvitedRoomHistorySchema
);

module.exports = { InvitedRoomHistory };
