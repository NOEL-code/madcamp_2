const { Attendance } = require("../models/attendance");
const { getUserById } = require("./userService");

exports.getAttendance = async (userId) => {
  try {
    const attendanceRecords = await Attendance.find({ userId }).lean().exec();
    return attendanceRecords.map(record => ({
      date: record.records[0].date,
      arriveTime: record.records[0].arriveTime,
      departTime: record.records[0].departTime,
      leave: record.records[0].leave
    }));
  } catch (error) {
    console.error('Error getting attendance:', error);
    throw new Error('Failed to get attendance');
  }
};

exports.recordArrival = async (userId) => {
  const today = new Date();
  const todayString = today.toLocaleDateString("en-CA");
  const currentTimeString = today.toTimeString().split(" ")[0];

  let attendance = await Attendance.findOneAndUpdate(
    { userId, "records.date": { $ne: todayString } },
    {
      $push: { records: { date: todayString, arriveTime: currentTimeString } },
    },
    { new: true, upsert: true }
  );

  if (!attendance) {
    attendance = new Attendance({
      userId,
      records: [{ date: todayString, arriveTime: currentTimeString }]
    });
    await attendance.save();
  }

  const user = await getUserById(userId);

  return {
    ...attendance.toObject(),
    userName: user.name,
  };
};

exports.recordLeave = async (userId) => {
  try {
    const today = new Date();
    const todayString = today.toLocaleDateString("en-CA");
    const currentTimeString = today.toTimeString().split(" ")[0];

    // 오늘 날짜의 출석 기록이 있는지 확인
    const attendance = await Attendance.findOneAndUpdate(
      { userId, "records.date": todayString },
      {
        $set: { "records.$.departTime": currentTimeString },
      },
      { new: true }
    );

    if (!attendance) {
      // 출석 기록이 없다면 에러를 반환
      throw new Error('No attendance record found for today');
    }

    const user = await getUserById(userId);

    return {
      ...attendance.toObject(),
      userName: user.name,
    };
  } catch (error) {
    console.error('Error recording leave:', error);
    throw new Error('Unable to record leave');
  }
};

exports.recordGoOut = async (userId) => {
  const today = new Date();
  const todayString = today.toLocaleDateString("en-CA");
  const currentTimeString = today.toTimeString().split(" ")[0];

  const attendance = await Attendance.findOneAndUpdate(
    { userId, "records.date": todayString },
    { $push: { "records.$.leave": { goOut: currentTimeString } } },
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
      "records.leave.goOut": { $ne: null },
      "records.leave.comeBack": null,
    },
    {
      $set: { "records.$[outer].leave.$[inner].comeBack": currentTimeString },
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

exports.getCurrentStatus = async (userId) => {
  const today = new Date();
  const todayString = today.toLocaleDateString("en-CA");

  const attendance = await Attendance.findOne({ userId, "records.date": todayString });

  if (!attendance) {
    return { status: 3 }; // 퇴근 (출석 기록 없음)
  }

  const record = attendance.records[0];

  if (!record.arriveTime) {
    return { status: 3 }; // 퇴근 (출근 기록 없음)
  }

  if (!record.departTime) {
    if (record.leave.length > 0 && !record.leave[record.leave.length - 1].comeBack) {
      return { status: 2 }; // 자리비움 (외출 중 복귀 기록 없음)
    }
    return { status: 1 }; // 출석 (출근 기록 있음, 퇴근 기록 없음)
  }

  return { status: 3 }; // 퇴근 (퇴근 기록 있음)
};

exports.updateStatus = async (userId, status) => {
  try {
    if (status === 1) {
      // 출석으로 변경되는 경우 출근 기록을 추가
      const today = new Date();
      const todayString = today.toLocaleDateString("en-CA");
      const currentTimeString = today.toTimeString().split(" ")[0];

      let attendance = await Attendance.findOneAndUpdate(
        { userId, "records.date": { $ne: todayString } },
        {
          $push: { records: { date: todayString, arriveTime: currentTimeString } },
        },
        { new: true, upsert: true }
      );

      if (!attendance) {
        attendance = new Attendance({
          userId,
          records: [{ date: todayString, arriveTime: currentTimeString }]
        });
        await attendance.save();
      }
    } else if (status === 2) {
      // 자리비움으로 변경되는 경우 외출 기록을 추가
      const today = new Date();
      const todayString = today.toLocaleDateString("en-CA");
      const currentTimeString = today.toTimeString().split(" ")[0];

      await Attendance.findOneAndUpdate(
        { userId, "records.date": todayString },
        { $push: { "records.$.leave": { goOut: currentTimeString } } },
        { new: true }
      );
    } else if (status === 3) {
      // 퇴근으로 변경되는 경우 퇴근 기록을 추가
      const today = new Date();
      const todayString = today.toLocaleDateString("en-CA");
      const currentTimeString = today.toTimeString().split(" ")[0];

      await Attendance.findOneAndUpdate(
        { userId, "records.date": todayString },
        {
          $set: { "records.$.departTime": currentTimeString },
        },
        { new: true }
      );
    }
  } catch (error) {
    console.error('Error updating status:', error);
    throw new Error('Failed to update status');
  }
};
