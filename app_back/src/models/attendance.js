const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  records: [
    {
      date: {
        type: String,
        required: true,
      },
      arriveTime: {
        type: String,
      },
      departTime: {
        type: String,
      },
      leave: [
        {
          goOut: {
            type: String,
          },
          comeBack: {
            type: String,
          },
        },
      ],
      workHours: {
        hours: { type: Number, default: 0 },
        minutes: { type: Number, default: 0 },
      },
    },
  ],
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

module.exports = { Attendance };
