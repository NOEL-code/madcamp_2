const { Attendance } = require("../models/Attendance");
const { getUserById } = require("./userService");

exports.recordArrival = async (userId) => {
  const today = new Date();
  const todayString = today.toLocaleDateString("en-CA");
  const currentTimeString = today.toTimeString().split(" ")[0];

  const attendance = await Attendance.findOneAndUpdate(
    { userId, "records.date": { $ne: todayString } },
    {
      $push: { records: { date: todayString, arriveTime: currentTimeString } },
    },
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
  const todayString = today.toLocaleDateString("en-CA");
  const currentTimeString = today.toTimeString().split(" ")[0];

  const attendance = await Attendance.findOneAndUpdate(
    { userId, "records.date": todayString },
    { $set: { "records.$.leaveTime": currentTimeString } },
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
  const todayString = today.toLocaleDateString("en-CA");
  const currentTimeString = today.toTimeString().split(" ")[0];

  const attendance = await Attendance.findOneAndUpdate(
    { userId, "records.date": todayString },
    { $push: { "records.$.away": { goOut: currentTimeString } } },
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
  const todayString = today.toLocaleDateString("en-CA");
  const currentTimeString = today.toTimeString().split(" ")[0];

  const attendance = await Attendance.findOneAndUpdate(
    {
      userId,
      "records.date": todayString,
      "records.away.goOut": { $ne: null },
      "records.away.comeBack": null,
    },
    {
      $set: { "records.$[outer].away.$[inner].comeBack": currentTimeString },
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
  const dateString = new Date(date).toLocaleDateString("en-CA");

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
