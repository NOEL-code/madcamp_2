const { applyRoomHistory } = require("../models/applyRoomHistory");

exports.getAppliedMember = async (roomId) => {
  let appliedMember = await applyRoomHistory.findOne(roomId);

  return appliedMember;
};

exports.applyRoom = async (userId, roomId) => {
  let appliedRoom = await applyRoomHistory.findOneAndUpdate(
    { roomId },
    { $push: { members: { userId, status: 1 } } },
    { new: true, upsert: true }
  );

  return appliedRoom;
};

exports.acceptApplication = async (userId, roomId) => {
  let updatedRoom = await applyRoomHistory.findOneAndUpdate(
    { roomId, "members.userId": userId },
    { $set: { "members.$.status": 2 } },
    { new: true }
  );

  return updatedRoom;
};

exports.rejectApplication = async (userId, roomId) => {
  let updatedRoom = await applyRoomHistory.findOneAndUpdate(
    { roomId, "members.userId": userId },
    { $set: { "members.$.status": 3 } },
    { new: true }
  );

  return updatedRoom;
};
