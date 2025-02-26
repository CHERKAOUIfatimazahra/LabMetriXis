
const isChercheur = (req, res, next) => {
  if (req.user && req.user.role === "chercheur") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Access denied. Chercheur role required." });
  }
};

module.exports = {
  isChercheur,
};