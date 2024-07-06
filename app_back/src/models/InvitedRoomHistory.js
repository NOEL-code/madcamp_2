const mongoose = require("mongoose");

const InvitedRoomHistorySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rooms: {
    type: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "room",
        },
        status: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
});

const User = mongoose.model("InvitedRoomHistory", InvitedRoomHistorySchema);

module.exports = { InvitedRoomHistory };
