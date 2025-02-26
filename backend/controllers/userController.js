const User = require("../models/User");

exports.getAvailableTeamMembers = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user._id } },
      "name email role institution specialty"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
