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
        // 각 기록의 날짜
        type: String,
        required: true,
      },
      arriveTime: {
        // 출근시간
        type: String,
      },
      leaveTime: {
        // 퇴근시간
        type: String,
      },
      away: [
        // 외출 기록
        {
          goOut: {
            type: String,
          },
          comeBack: {
            type: String,
          },
        },
      ],
    },
  ],
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

module.exports = { Attendance };
