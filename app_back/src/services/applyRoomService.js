const { applyRoomHistory } = require("../models/applyRoomHistory");
const { getUserById } = require("./userService");
const Room = require("../models/Room");

exports.getApplyHistory = async () => {
  console.log("Fetching apply history");
  let applyHistory = await applyRoomHistory.find();
  return applyHistory;
};

exports.getAppliedRoom = async (userId) => {
  console.log(`Fetching applied rooms for userId: ${userId}`);
  let appliedRooms = await applyRoomHistory
    .find({ "members.userId": userId })
    .populate("roomId members.userId");

  return appliedRooms.map((room) => ({
    roomId: room.roomId,
    members: room.members.map((member) => ({
      userId: member.userId,
      status: member.status,
    })),
  }));
};

exports.getAppliedMember = async (roomId) => {
  console.log(`Fetching applied members for roomId: ${roomId}`);
  let appliedMember = await applyRoomHistory.findOne({ roomId });

  if (!appliedMember) {
    console.log("No applied members found");
    return null;
  }

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
  console.log(`Applying room for userId: ${userId}, roomId: ${roomId}`);
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

exports.cancelApplication = async (userId, roomId) => {
  console.log(`Cancelling application for userId: ${userId}, roomId: ${roomId}`);
  let updatedRoom = await applyRoomHistory.findOneAndUpdate(
    { roomId, "members.userId": userId },
    { $set: { "members.$.status": 4 } },
    { new: true }
  );

  return updatedRoom;
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
  console.log(`Rejecting application for userId: ${userId}, roomId: ${roomId}`);
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

exports.getWaitingUsersByRoomId = async (roomId) => {
  console.log(`Fetching waiting users for roomId: ${roomId}`);
  const waitingUsers = await applyRoomHistory.findOne(
    { roomId },
    { members: { $elemMatch: { status: 1 } } }
  ).populate('members.userId', 'name'); // userId 필드를 통해 유저 이름을 포함하여 인구합니다.

  if (!waitingUsers) {
    console.log("No waiting users found");
    return null;
  }

  return waitingUsers.members;
};