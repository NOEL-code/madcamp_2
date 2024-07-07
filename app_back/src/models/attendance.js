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
<<<<<<< HEAD
        type: String,
=======
        type: Date,
>>>>>>> parent of 5cfeb04 (Remove cached files)
        required: true,
      },
      arriveTime: {
        // 출근시간
<<<<<<< HEAD
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
=======
        type: Date,
      },
      departTime: {
        // 퇴근시간
        type: Date,
      },
      leave: [
        // 외출 기록
        {
          goOut: {
            type: Date,
          },
          comeBack: {
            type: Date,
>>>>>>> parent of 5cfeb04 (Remove cached files)
          },
        },
      ],
    },
  ],
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

module.exports = { Attendance };
