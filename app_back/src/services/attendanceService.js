const { Attendance } = require("../models/Attendance");

exports.getRooms = async () => {
    let attendance = await Attendance.find();
  
    if (!attendance || attendance.length === 0) {
      throw new Error("There are no attendance");
    }
  
    return attendance;
  };

  exports.recordAttendance = async (attendanceInfo) => {
    const { records } = attendanceInfo;

  const newAttendance = new Attendance({
    records
  });

  await newAttendance.save();
  return newAttendance;
  }