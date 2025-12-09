import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "15m", 
  });
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d", 
  });
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

export const createUser = async (userData) => {
  const user = await User.create(userData);
  return user;
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findUserById = async (id) => {
  return await User.findById(id).select("-password -refreshToken");
};

export const updateRefreshToken = async (userId, refreshToken) => {
  await User.findByIdAndUpdate(userId, { refreshToken });
};

export const clearRefreshToken = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

export const getPendingChauffeurs = async () => {
  return await User.find({
    role: "chauffeur",
    accountStatus: "pending",
  }).select("-password -refreshToken");
};

export const updateAccountStatus = async (userId, status) => {
  return await User.findByIdAndUpdate(
    userId,
    { accountStatus: status },
    { new: true }
  ).select("-password -refreshToken");
};

export const getAllUsers = async (filters = {}) => {
  return await User.find(filters).select("-password -refreshToken");
};
