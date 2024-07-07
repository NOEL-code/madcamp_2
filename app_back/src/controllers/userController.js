const { registerUser } = require("../services/userService");
const { getUsers, updateProfileImage } = require("../services/userService");

exports.registerUser = async (req, res) => {
  const { userEmail, userPassword, name, phoneNumber, photoUrl } = req.body;

  try {
    const token = await registerUser({
      userEmail,
      userPassword,
      name,
      phoneNumber,
      photoUrl,
    });
    res.status(201).json({ token });
  } catch (err) {
    if (err.message === "User already exists") {
      return res.status(400).json({ message: err.message });
    }
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { userId } = req.body;
  const imageUrl = req.file.location; // S3에 저장된 이미지의 URL

  try {
    const resImageUrl = await updateProfileImage(userId, imageUrl);
    res.status(200).json({ imageUrl: resImageUrl });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile image" });
  }
};
