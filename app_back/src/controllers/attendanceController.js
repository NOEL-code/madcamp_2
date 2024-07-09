const {
  getAttendance,
  recordArrival,
  recordLeave,
  recordGoOut,
  recordComeBack,
  getAttendanceByDate
} = require("../services/attendanceService");
const { getUserById } = require('../services/userService');

const checkAdmin = async (userId) => {
  const user = await getUserById(userId);
  return user.role === 'admin';
};

exports.getAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const attendance = await getAttendance(userId);
    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.recordArrival = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!await checkAdmin(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const attendance = await recordArrival(userId);
    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.recordLeave = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!await checkAdmin(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const attendance = await recordLeave(userId);
    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.recordGoOut = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!await checkAdmin(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const attendance = await recordGoOut(userId);
    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.recordComeBack = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!await checkAdmin(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const attendance = await recordComeBack(userId);
    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAttendanceByDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = new Date(req.params.date).setHours(0, 0, 0, 0); // YYYY-MM-DD 형식의 날짜
    const attendance = await getAttendanceByDate(userId, date);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
