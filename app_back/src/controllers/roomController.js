const {
  getRooms,
  getUserRooms,
  getHostRooms,
  createRoom,
  addMembersToRoom,
  removeMemberFromRoom,
  updateRoomDescription,
  deleteRoomById,
  getRoomInfo,
  getAllUsers,
  getAllUsersForRoom,
} = require("../services/roomService");

exports.getRooms = async (req, res) => {
  try {
    const rooms = await getRooms();
    res.status(200).json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserRooms = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userRooms = await getUserRooms(userId);
    res.status(200).json(userRooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getHostRooms = async (req, res) => {
  const hostId = req.params.hostId;

  try {
    const hostRooms = await getHostRooms(hostId);
    res.status(200).json(hostRooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createRoom = async (req, res) => {
  const roomInfo = req.body;

  try {
    const createdRoom = await createRoom(roomInfo);
    res.status(201).json(createdRoom);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeMemberFromRoom = async (req, res) => {
  const { roomId, memberId } = req.params;

  try {
    const updatedRoom = await removeMemberFromRoom(roomId, memberId);
    res.status(200).json(updatedRoom);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteRoomById = async (req, res) => {
  const { roomId } = req.params;

  try {
    const deletedRoom = await deleteRoomById(roomId);
    res.status(200).json(deletedRoom);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addMembersToRoom = async (req, res) => {
  const { roomId } = req.params;
  const { userIds } = req.body;

  console.log(roomId);
  console.log(userIds);

  try {
    const updatedRoom = await addMembersToRoom(roomId, userIds);
    res.status(200).json(updatedRoom);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateRoomDescription = async (req, res) => {
  const { roomId } = req.params;
  const { roomName, roomDescription } = req.body;

  try {
    const updatedRoom = await updateRoomDescription(
      roomId,
      roomName,
      roomDescription
    );
    console.log(updatedRoom);
    res.status(200).json(updatedRoom);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRoomInfo = async (req, res) => {
  const { roomId } = req.params;

  try {
    const roomInfo = await getRoomInfo(roomId);
    res.status(200).json(roomInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  const { roomId } = req.query;

  try {
    const users = await getAllUsers(roomId);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.getAllUsersForRoom = async (req, res) => {
  const { roomId } = req.params;

  try {
    const users = await getAllUsersForRoom(roomId);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users for room:", error);
    res.status(500).json({ message: "Failed to fetch users for room" });
  }
};
