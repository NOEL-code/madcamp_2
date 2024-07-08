const { InvitedRoomHistory } = require("../models/InvitedRoomHistory");
const { addMembersToRoom } = require("./roomService");

exports.getInvitedRooms = async (userId) => {
  const invitedRooms = await InvitedRoomHistory.find({ userId });

  if (!invitedRooms || invitedRooms.length === 0) {
    throw new Error("There are no invited rooms for this user");
  }

  return invitedRooms;
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
  return updatedInvite;
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

  return updatedInvite;
};

exports.sendInvite = async (userId, roomId) => {
  let invitedRoomHistory = await InvitedRoomHistory.findOne({ userId });

  if (!invitedRoomHistory) {
    invitedRoomHistory = new InvitedRoomHistory({ userId, rooms: [] });
  }

  invitedRoomHistory.rooms.push({ RoomId: roomId });
  await invitedRoomHistory.save();

  return invitedRoomHistory;
};
