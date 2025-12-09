import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select(
        "-password -refreshToken"
      );

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (
        req.user.role === "chauffeur" &&
        req.user.accountStatus !== "approved"
      ) {
        return res.status(403).json({
          message: "Your account is pending approval by admin",
          accountStatus: req.user.accountStatus,
        });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};

export const chauffeurOnly = (req, res, next) => {
  if (req.user && req.user.role === "chauffeur") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Chauffeur only." });
  }
};

export const adminOrSelf = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "admin" || req.user._id.toString() === req.params.id)
  ) {
    next();
  } else {
    res.status(403).json({ message: "Access denied." });
  }
};
