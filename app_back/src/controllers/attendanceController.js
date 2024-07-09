const {
  getAttendance,
  recordArrival,
  recordLeave,
  recordGoOut,
  recordComeBack,
  getAttendanceByDate,
  getCurrentStatus,
  updateStatus // 새로 추가된 함수
} = require("../services/attendanceService");
const { getUserById } = require('../services/userService');

exports.getAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const attendance = await getAttendance(userId);
    res.status(200).json(attendance);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: 'Failed to fetch attendance data.' });
  }
};

exports.recordArrival = async (req, res) => {
  const { userId } = req.params;
  try {
    const attendance = await recordArrival(userId);
    res.status(200).json({ message: '출근 기록 완료', attendance });
  } catch (error) {
    console.error('Error recording arrival:', error);
    res.status(500).json({ message: '출근 기록 실패', error: error.message });
  }
};

exports.recordLeave = async (req, res) => {
  const { userId } = req.params;
  try {
    const attendance = await recordLeave(userId);
    res.status(200).json({ message: '퇴근 기록 완료', attendance });
  } catch (error) {
    console.error('Error recording leave:', error);
    res.status(500).json({ message: '퇴근 기록 실패', error: error.message });
  }
};

exports.recordGoOut = async (req, res) => {
  const { userId } = req.params;
  try {
    const attendance = await recordGoOut(userId);
    res.status(200).json({ message: '외출 기록 완료', attendance });
  } catch (error) {
    console.error('Error recording go out:', error);
    res.status(500).json({ message: '외출 기록 실패', error: error.message });
  }
};

exports.recordComeBack = async (req, res) => {
  const { userId } = req.params;
  try {
    const attendance = await recordComeBack(userId);
    res.status(200).json({ message: '복귀 기록 완료', attendance });
  } catch (error) {
    console.error('Error recording come back:', error);
    res.status(500).json({ message: '복귀 기록 실패', error: error.message });
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
    console.error('Error fetching attendance by date:', err);
    res.status(500).json({ message: 'Failed to fetch attendance data by date.' });
  }
};

exports.getCurrentStatus = async (req, res) => {
  try {
    const userId = req.params.userId;
    const status = await getCurrentStatus(userId);
    res.status(200).json(status);
  } catch (error) {
    console.error('Error fetching current status:', error);
    res.status(500).json({ message: 'Failed to fetch current status.' });
  }
};

exports.updateStatus = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;
  try {
    await updateStatus(userId, status);
    res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};
