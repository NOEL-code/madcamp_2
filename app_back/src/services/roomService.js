const { Room } = require("../models/Room");
const { getUserById } = require("./userService");

exports.getRooms = async () => {
  let rooms = await Room.find();

  if (!rooms || rooms.length === 0) {
    throw new Error("There are no rooms");
  }

  return rooms;
};

exports.getUserRooms = async (userId) => {
  let rooms = await Room.find({ "members.userId": userId });

  if (!rooms || rooms.length === 0) {
    throw new Error("There are no rooms for this user");
  }

  return rooms;
};

exports.getHostRooms = async (hostId) => {
  let rooms = await Room.find({ host: hostId });

  if (!rooms || rooms.length === 0) {
    throw new Error("There are no rooms for this host");
  }

  return rooms;
};

exports.createRoom = async (roomInfo) => {
  const { roomName, host, members } = roomInfo;

  const newRoom = new Room({
    roomName,
    host,
    members: members.map((member) => ({ userId: member.userId })),
  });

  await newRoom.save();
  return newRoom;
};

exports.deleteRoomById = async (roomId) => {
  const deletedRoomId = await Room.findByIdAndDelete(roomId);

  if (!deletedRoomId) {
    throw new Error("Room not found");
  }

  return deletedRoomId;
};

exports.removeMemberFromRoom = async (roomId, userId) => {
  const updatedRoom = await Room.findByIdAndUpdate(
    roomId,
    { $pull: { members: { userId } } },
    { new: true }
  );

  if (!updatedRoom) {
    throw new Error("Room not found or member not in room");
  }

  return updatedRoom;
};

exports.addMembersToRoom = async (roomId, userIds) => {
  const updatedRoom = await Room.findByIdAndUpdate(
    roomId,
    {
      $addToSet: {
        members: { $each: userIds.map((userId) => ({ userId })) },
      },
    },
    { new: true }
  );

  if (!updatedRoom) {
    throw new Error("Room not found");
  }

  return updatedRoom;
};

exports.updateRoomDescription = async (roomId, title, subtitle) => {
  const updatedRoom = await Room.findByIdAndUpdate(
    roomId,
    {
      title: title,
      subTitle: subtitle,
    },
    { new: true }
  );

  if (!updatedRoom) {
    throw new Error("Room not found");
  }

  return updatedRoom;
};
