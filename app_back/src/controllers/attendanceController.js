const { Attendance } = require("../models/Attendance");
const {
    getAttendance
  } = require("../services/attendanceService");

exports.getAttendance = async (req, res) => {
    try {
        const userId = req.user.id;
        const attendance = await Attendance.findOne({userId})
        if(!attendance) {
            return res.status(400).json({"Attendance record not found"})
        }
        res.status(200).json(attendance);
    } catch(err) {
        res.status(500).json({message: err.message});
    } 
}

exports.recordArriveTime = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().setHours(0, 0, 0, 0);
        const attendance = await Attendance.findOneAndUpdate(
          { userId, "records.date": { $ne: today } },
          { $push: { records: { date: today, arriveTime: new Date() } } },
          { new: true, upsert: true }
        );
        res.status(200).json(attendance);
      } catch (err) {
        res.status(500).json({ message: err.message });
};

exports.recordDepartTime = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().setHours(0, 0, 0, 0);
        const attendance = await Attendance.findOneAndUpdate(
          { userId, "records.date": today },
          { $set: { "records.$.departTime": new Date() } },
          { new: true }
        );
        res.status(200).json(attendance);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
};

exports.recordGoOut = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().setHours(0, 0, 0, 0);
        const attendance = await Attendance.findOneAndUpdate(
          { userId, "records.date": today },
          { $push: { "records.$.leave": { goOut: new Date() } } },
          { new: true }
        );
        res.status(200).json(attendance);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
}

exports.recordComeBack = asynce (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().setHours(0, 0, 0, 0);
        const attendance = await Attendance.findOneAndUpdate(
          { userId, "records.date": today, "records.leave.goOut": { $ne: null }, "records.leave.comeBack": null },
          { $set: { "records.$[outer].leave.$[inner].comeBack": new Date() } },
          {
            arrayFilters: [{ "outer.date": today }, { "inner.comeBack": null }],
            new: true
          }
        );
        res.status(200).json(attendance);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
}