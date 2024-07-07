const {
  applyRoom,
  acceptApplication,
  rejectApplication,
  getAppliedMember,
} = require("../services/applyRoomService");

exports.getAppliedMember = async (req, res) => {
  const { roomId } = req.params;

  try {
    const appliedMember = await getAppliedMember(roomId);
    res.status(200).json(appliedMember);
  } catch (err) {
    console.err(err.message);
    res.status(500).json({ message: "Server error" });
  }
};
exports.applyRoom = async (req, res) => {
  const { userId, roomId } = req.body;

  try {
    const appliedRoom = await applyRoom(userId, roomId);
    res.status(200).json(appliedRoom);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.acceptApplication = async (req, res) => {
  const { userId, roomId } = req.params;

  try {
    const updatedRoom = await acceptApplication(userId, roomId);
    res.status(200).json(updatedRoom);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rejectApplication = async (req, res) => {
  const { userId, roomId } = req.params;

  try {
    const updatedRoom = await rejectApplication(userId, roomId);
    res.status(200).json(updatedRoom);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};
