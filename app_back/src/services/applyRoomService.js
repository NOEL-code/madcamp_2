const { applyRoomHistory } = require("../models/applyRoomHistory");
const { getUserById } = require("./userService");

exports.getAppliedMember = async (roomId) => {
  let appliedMember = await applyRoomHistory.findOne(roomId);

  if (!appliedMember) return null;

  const memberDetails = await Promise.all(
    appliedMember.members.map(async (member) => {
      const user = await getUserById(member.userId);
      return {
        userId: member.userId,
        name: user.name,
        status: member.status,
      };
    })
  );

  return { roomId: appliedMember.roomId, members: memberDetails };
};

exports.applyRoom = async (userId, roomId) => {
  let appliedRoom = await applyRoomHistory.findOneAndUpdate(
    { roomId },
    { $push: { members: { userId, status: 1 } } },
    { new: true, upsert: true }
  );

  const user = await getUserById(userId);

  return {
    roomId: appliedRoom.roomId,
    members: appliedRoom.members.map((member) => ({
      userId: member.userId,
      name: member.userId === userId ? user.name : undefined,
      status: member.status,
    })),
  };
};

exports.acceptApplication = async (userId, roomId) => {
  let updatedRoom = await applyRoomHistory.findOneAndUpdate(
    { roomId, "members.userId": userId },
    { $set: { "members.$.status": 2 } },
    { new: true }
  );

  const user = await getUserById(userId);

  return {
    roomId: updatedRoom.roomId,
    members: updatedRoom.members.map((member) => ({
      userId: member.userId,
      name: member.userId === userId ? user.name : undefined,
      status: member.status,
    })),
  };
};

exports.rejectApplication = async (userId, roomId) => {
  let updatedRoom = await applyRoomHistory.findOneAndUpdate(
    { roomId, "members.userId": userId },
    { $set: { "members.$.status": 3 } },
    { new: true }
  );

  const user = await getUserById(userId);

  return {
    roomId: updatedRoom.roomId,
    members: updatedRoom.members.map((member) => ({
      userId: member.userId,
      name: member.userId === userId ? user.name : undefined,
      status: member.status,
    })),
  };
};
