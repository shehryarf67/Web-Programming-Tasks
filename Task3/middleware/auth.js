const authMiddleware = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }

  return res.status(401).send("Access denied. Please login first");
};

module.exports = authMiddleware;