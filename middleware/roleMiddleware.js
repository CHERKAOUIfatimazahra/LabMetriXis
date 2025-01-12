// middleware for roule
const User = require("../models/User");

exports.isOrganizer = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (user.role !== "organizer") {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};