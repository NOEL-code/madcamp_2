const { Room } = require("../models/Room");
const { getUserById } = require("./userService");

exports.getRooms = async () => {
  let rooms = await Room.find();

  return rooms;
};

exports.getUserRooms = async (userId) => {
  let rooms = await Room.find({ "members.userId": userId });

  return rooms;
};

exports.getHostRooms = async (hostId) => {
  let rooms = await Room.find({ host: hostId });

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

  const membersWithNames = await Promise.all(
    newRoom.members.map(async (member) => {
      const user = await getUserById(member.userId);
      return { userId: member.userId, name: user.name };
    })
  );

  return { ...newRoom._doc, members: membersWithNames };
};

exports.deleteRoomById = async (roomId) => {
  const deletedRoom = await Room.findByIdAndDelete(roomId);

  if (!deletedRoom) {
    throw new Error("Room not found");
  }

  return deletedRoom;
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

  const membersWithNames = await Promise.all(
    updatedRoom.members.map(async (member) => {
      const user = await getUserById(member.userId);
      return { userId: member.userId, name: user.name };
    })
  );

  return { ...updatedRoom._doc, members: membersWithNames };
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

  const membersWithNames = await Promise.all(
    updatedRoom.members.map(async (member) => {
      const user = await getUserById(member.userId);
      return { userId: member.userId, name: user.name };
    })
  );

  return { ...updatedRoom._doc, members: membersWithNames };
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

  const membersWithNames = await Promise.all(
    updatedRoom.members.map(async (member) => {
      const user = await getUserById(member.userId);
      return { userId: member.userId, name: user.name };
    })
  );

  return { ...updatedRoom._doc, members: membersWithNames };
};
