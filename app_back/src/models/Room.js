const mongoose = require("mongoose");

const RoomSchema = mongoose.Schema({
  roomName: String,
  roomDescription: String,
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

const Room = mongoose.model("Room", RoomSchema);

module.exports = { Room };
