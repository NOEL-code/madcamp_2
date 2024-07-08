const { Attendance } = require("../models/Attendance");
const { getUserById } = require("./userService");

exports.recordArrival = async (userId) => {
  const today = new Date();
  const todayString = today.toLocaleDateString("en-CA"); // 로컬 시간대로 날짜 변환
  const currentTimeString = today.toTimeString().split(" ")[0]; // 시간 부분만 문자열로 변환

  const attendance = await Attendance.findOneAndUpdate(
    { userId, "records.date": { $ne: todayString } },
    {
      $push: { records: { date: todayString, arriveTime: currentTimeString } },
    }, // arriveTime을 현재 시간으로 설정
    { new: true, upsert: true }
  );

  const user = await getUserById(userId);

  return {
    ...attendance.toObject(),
    userName: user.name,
  };
};

exports.recordLeave = async (userId) => {
  const today = new Date();
  const todayString = today.toLocaleDateString("en-CA"); // 로컬 시간대로 날짜 변환
  const currentTimeString = today.toTimeString().split(" ")[0]; // 시간 부분만 문자열로 변환

  const attendance = await Attendance.findOneAndUpdate(
    { userId, "records.date": todayString },
    { $set: { "records.$.leaveTime": currentTimeString } }, // leaveTime을 현재 시간으로 설정
    { new: true }
  );

  const user = await getUserById(userId);

  return {
    ...attendance.toObject(),
    userName: user.name,
  };
};

exports.recordGoOut = async (userId) => {
  const today = new Date();
  const todayString = today.toLocaleDateString("en-CA"); // 로컬 시간대로 날짜 변환
  const currentTimeString = today.toTimeString().split(" ")[0]; // 시간 부분만 문자열로 변환

  const attendance = await Attendance.findOneAndUpdate(
    { userId, "records.date": todayString },
    { $push: { "records.$.away": { goOut: currentTimeString } } }, // goOut을 현재 시간으로 설정
    { new: true }
  );

  const user = await getUserById(userId);

  return {
    ...attendance.toObject(),
    userName: user.name,
  };
};

exports.recordComeBack = async (userId) => {
  const today = new Date();
  const todayString = today.toLocaleDateString("en-CA"); // 로컬 시간대로 날짜 변환
  const currentTimeString = today.toTimeString().split(" ")[0]; // 시간 부분만 문자열로 변환

  const attendance = await Attendance.findOneAndUpdate(
    {
      userId,
      "records.date": todayString,
      "records.away.goOut": { $ne: null },
      "records.away.comeBack": null,
    },
    {
      $set: { "records.$[outer].away.$[inner].comeBack": currentTimeString }, // comeBack을 현재 시간으로 설정
    },
    {
      arrayFilters: [{ "outer.date": todayString }, { "inner.comeBack": null }],
      new: true,
    }
  );

  const user = await getUserById(userId);

  return {
    ...attendance.toObject(),
    userName: user.name,
  };
};

exports.getAttendanceByDate = async (userId, date) => {
  const dateString = new Date(date).toLocaleDateString("en-CA"); // 로컬 시간대로 날짜 변환

  const attendance = await Attendance.findOne(
    { userId, "records.date": dateString },
    { "records.$": 1 }
  )
    .populate("userId")
    .populate("roomId");
  if (!attendance) {
    throw new Error("Attendance record not found");
  }

  const user = await getUserById(userId);

  return {
    ...attendance.toObject(),
    userName: user.name,
  };
};
