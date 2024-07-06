const mongoose = require("mongoose");

const RoomApplyHistorySchema = mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
  members: {
    type: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
});

const User = mongoose.model("RoomApplyHistory", RoomApplyHistorySchema);

module.exports = { RoomApplyHistory };
