const { InvitedRoomHistory } = require("../models/InvitedRoomHistory");
const { addMembersToRoom } = require("./roomMemberService"); // 별도 모듈로 분리된 함수 임포트
const { getUserById } = require("./userService");

exports.getInvitedRooms = async (userId) => {
  const invitedRooms = await InvitedRoomHistory.find({ userId });

  if (!invitedRooms || invitedRooms.length === 0) {
    throw new Error("There are no invited rooms for this user");
  }

  const user = await getUserById(userId);

  return {
    userId: userId,
    userName: user.name,
    invitedRooms: invitedRooms.map((room) => ({
      roomId: room.roomId,
      status: room.status,
    })),
  };
};

exports.acceptInvite = async (userId, roomId) => {
  const updatedInvite = await InvitedRoomHistory.findOneAndUpdate(
    { userId, "rooms.RoomId": roomId },
    { $set: { "rooms.$.status": 2 } },
    { new: true }
  );

  if (!updatedInvite) {
    throw new Error("Invite not found");
  }

  await addMembersToRoom(roomId, [userId]);

  const user = await getUserById(userId);

  return {
    userId: userId,
    userName: user.name,
    updatedInvite: updatedInvite.toObject(),
  };
};

exports.rejectInvite = async (userId, roomId) => {
  const updatedInvite = await InvitedRoomHistory.findOneAndUpdate(
    { userId, "rooms.RoomId": roomId },
    { $set: { "rooms.$.status": 3 } },
    { new: true }
  );

  if (!updatedInvite) {
    throw new Error("Invite not found");
  }

  const user = await getUserById(userId);

  return {
    userId: userId,
    userName: user.name,
    updatedInvite: updatedInvite.toObject(),
  };
};

exports.sendInvite = async (userIds, roomId) => {
  for (const userId of userIds) {
    let invitedRoomHistory = await InvitedRoomHistory.findOne({ userId });

    if (!invitedRoomHistory) {
      invitedRoomHistory = new InvitedRoomHistory({ userId, rooms: [] });
    }

    invitedRoomHistory.rooms.push({ RoomId: roomId });
    await invitedRoomHistory.save();

    const user = await getUserById(userId);

    // Add code to send notification/email to the user about the invite

    console.log(`Invite sent to ${user.name}`);
  }
};
