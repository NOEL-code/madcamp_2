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

const parseTimeStringToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const calTot = (date, on, off, away) => {
  const onMinutes = parseTimeStringToMinutes(on);
  const offMinutes = parseTimeStringToMinutes(off);

  let totalAwayMinutes = 0;

  if (away.length !== 0) {
    totalAwayMinutes = away.reduce((total, period) => {
      const awayMinutes = parseTimeStringToMinutes(period.goOut);
      const comebackMinutes = parseTimeStringToMinutes(period.comeBack);
      return total + (comebackMinutes - awayMinutes);
    }, 0);
  }

  const totalMinutes = offMinutes - onMinutes - totalAwayMinutes;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes)
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

    const dayRecord = attendance.records.find(record => record.date ==todayString);
    console.log('dayRecord:', dayRecord);
    if (dayRecord) {
      const {hours, minutes} = calTot(dayRecord.date, dayRecord.arriveTime, dayRecord.departTime, dayRecord.leave);
      console.log('time', hours, minutes);
      dayRecord.workHours.hours = hours;
      dayRecord.workHours.minutes = minutes;

      await attendance.save();
    }

    //이까지가 퇴근 기록한거임
    //이제 출근, 외출시간 받아와야돼
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

const getMinutesFromWorkHours = (workHours) => {
  return (workHours.hours * 60) + workHours.minutes;
};

exports.getTopWorker = async (roomId) => {
  try {
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
    const eightDaysAgoString = eightDaysAgo.toISOString().split('T')[0];

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    console.log(`Querying records from ${eightDaysAgoString} to ${yesterdayString}`);

    const attendanceRecords = await Attendance.find({
      "records.date": { $gte: eightDaysAgoString, $lte: yesterdayString },
    }).populate("userId");

    console.log('Attendance records found:', attendanceRecords);

    if (attendanceRecords.length === 0) {
      console.log('No attendance records found for the specified date range.');
      return null;
    }

    const userWorkTimes = {};

    attendanceRecords.forEach(record => {
      const userId = record.userId._id.toString();
      if (!userWorkTimes[userId]) {
        userWorkTimes[userId] = 0;
      }

      record.records.forEach(dayRecord => {
        if (dayRecord.date >= eightDaysAgoString && dayRecord.date <= yesterdayString) {
          userWorkTimes[userId] += getMinutesFromWorkHours(dayRecord.workHours);
        }
      });
    });

    console.log('User work times:', userWorkTimes);

    const topWorkerId = Object.keys(userWorkTimes).reduce((a, b) => {
      return userWorkTimes[a] > userWorkTimes[b] ? a : b;
    }, null);

    console.log('Top worker ID:', topWorkerId);

    return topWorkerId;
  } catch (error) {
    console.error("Error getting top worker:", error);
    throw new Error("Failed to get top worker");
  }
};