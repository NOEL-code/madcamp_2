const mongoose = require("mongoose");

const RoomSchema = mongoose.Schema({
  roomName: String,
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  members: {
    type: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
});

const User = mongoose.model("Room", RoomSchema);

module.exports = { Room };
