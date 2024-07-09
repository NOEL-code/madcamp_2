const {
  applyRoom,
  acceptApplication,
  rejectApplication,
  getAppliedMember,
  getApplyHistory,
  getAppliedRoom,
  cancelApplication, 
  getWaitingUsersByRoomId
  
} = require("../services/applyRoomService");

exports.getApply = async (req, res) => {
  try {
    const applyHistory = await getApplyHistory();
    res.status(200).json(applyHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAppliedRoomByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const appliedRoom = await getAppliedRoom(userId);
    res.status(200).json(appliedRoom);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAppliedMember = async (req, res) => {
  const { roomId } = req.params;
  console.log("Received request for roomId:", roomId); // 추가된 로그

  try {
    const appliedMembers = await getAppliedMembersByRoomId(roomId);
    res.status(200).json(appliedMembers);
  } catch (error) {
    console.error('Error fetching applied members:', error.message);
    res.status(500).json({ message: 'Server error' });
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

exports.cancelApplication = async (req, res) => {
  const { userId, roomId } = req.params;

  try {
    const updatedRoom = await cancelApplication(userId, roomId);
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

exports.getWaitingUsersByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;
    const waitingUsers = await getWaitingUsersByRoomId(roomId);
    
    if (!waitingUsers) {
      return res.status(404).json({ message: "No waiting users found." });
    }

    res.status(200).json({ members: waitingUsers });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};