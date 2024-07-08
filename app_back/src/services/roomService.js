const { Room } = require("../models/Room");
const { getUserById } = require("./userService");
const { sendInvite } = require("./invitedRoomService");
const mongoose = require("mongoose");

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

  try {
    // 멤버 유효성 검사
    const validMembers = [];
    for (const member of members) {
      const user = await getUserById(member.userId);
      if (user) {
        validMembers.push(new mongoose.Types.ObjectId(member.userId));
      }
    }

    // 새로운 방 생성
    const newRoom = new Room({
      roomName,
      host: new mongoose.Types.ObjectId(host), // host도 ObjectId로 변환
      members: validMembers,
    });

    const createdRoom = await newRoom.save();

    return createdRoom;
  } catch (error) {
    console.error("Failed to create room:", error);
    throw error; // 에러를 호출한 쪽에서 처리할 수 있도록 던짐
  }
  // const newRoom = new Room({
  //   roomName,
  //   host,
  //   members: members.map((member) => member.userId),
  // });

  // const createdRoom = await newRoom.save();
  // // const createdRoomId = createdRoom._id;

  // const invitingMembersId = members.map((member) => member.userId);
  // await sendInvite(invitingMembersId, createdRoomId);

  // return createdRoom;
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
