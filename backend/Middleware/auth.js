import jwt from "jsonwebtoken";

const auth = function(req, res, next) {
  const token = req.headers.authorization;
  if (!token)
    return res.status(401).json("Access denied. No token provided");
  try {
    const verified = jwt.verify(token, "secretkey");
    req.admin = verified;
    next();
  } catch (err) {
    res.status(400).json("Invalid token");
  }
};

export default auth;