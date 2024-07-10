const {
  applyRoom,
  rejectApplication,
  getAppliedMember,
  getApplyHistory,
  getAppliedRoom,
  cancelApplication,
  getWaitingUsersByRoomId,
  acceptApplication,
} = require("../services/applyRoomService");

exports.getApply = async (req, res) => {
  try {
    console.log("Received request to get apply history");
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
    console.log(`Received request to get applied rooms for userId: ${userId}`);
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
    const appliedMembers = await getAppliedMember(roomId);
    res.status(200).json(appliedMembers);
  } catch (error) {
    console.error("Error fetching applied members:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.applyRoom = async (req, res) => {
  const { userId, roomId } = req.body;

  try {
    console.log(
      `Received request to apply room for userId: ${userId}, roomId: ${roomId}`
    );
    const appliedRoom = await applyRoom(userId, roomId);
    res.status(200).json(appliedRoom);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.acceptApplication = async (req, res) => {
  const { roomId, userId } = req.params; // Extract roomId and userId from req.params
  try {
    console.log(
      `Received request to accept application for userId: ${userId}, roomId: ${roomId}`
    );
    await acceptApplication(roomId, userId);
    res.status(200).json({ message: "Member approved successfully" });
  } catch (error) {
    console.error("Failed to approve member:", error);
    res.status(500).json({ error: "Failed to approve member" });
  }
};

exports.cancelApplication = async (req, res) => {
  const { userId, roomId } = req.params;

  try {
    console.log(
      `Received request to cancel application for userId: ${userId}, roomId: ${roomId}`
    );
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
    console.log(
      `Received request to reject application for userId: ${userId}, roomId: ${roomId}`
    );
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
    console.log(`Received request to get waiting users for roomId: ${roomId}`);
    const waitingUsers = await getWaitingUsersByRoomId(roomId);

    if (!waitingUsers) {
      console.log("No waiting users found");
      return res.status(404).json({ message: "No waiting users found." });
    }

    res.status(200).json({ members: waitingUsers });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
