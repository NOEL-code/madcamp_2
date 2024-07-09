const { getUserById } = require('../services/userService');

const checkAdmin = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = checkAdmin;
