const {
  getInvitedRooms,
  acceptInvite,
  rejectInvite,
  sendInvite,
} = require("../services/invitedRoomService");

exports.getInvitedRooms = async (req, res) => {
  const userId = req.params.userId;

  try {
    const invitedRooms = await getInvitedRooms(userId);
    res.status(200).json(invitedRooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.acceptInvite = async (req, res) => {
  const { userId, roomId } = req.params;

  try {
    const updatedInvite = await acceptInvite(userId, roomId);
    res.status(200).json(updatedInvite);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rejectInvite = async (req, res) => {
  const { userId, roomId } = req.params;

  try {
    const updatedInvite = await rejectInvite(userId, roomId);
    res.status(200).json(updatedInvite);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.sendInvite = async (req, res) => {
  const { userId, roomId } = req.body;

  try {
    const invitedRoomHistory = await sendInvite(userId, roomId);
    res.status(201).json(invitedRoomHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};
