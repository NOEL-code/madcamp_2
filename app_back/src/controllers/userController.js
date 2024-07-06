const { registerUser } = require("../services/userService");

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