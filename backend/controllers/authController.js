import {
  validateRegister,
  validateLogin,
} from "../validators/authValidator.js";
import * as authService from "../services/authService.js";

export const registerUser = async (req, res) => {
  try {
    const { error } = validateRegister(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const {
      name,
      email,
      password,
      phoneNumber,
      nationalId,
      licenseNumber,
      licenseType,
      address,
      dateOfBirth,
    } = req.body;

    const userExists = await authService.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userData = {
      name,
      email,
      password,
      role: "chauffeur",
      phoneNumber,
      nationalId,
      licenseNumber,
      licenseType,
      address,
      dateOfBirth,
      accountStatus: "pending",
    };

    const user = await authService.createUser(userData);

    if (user) {
      const accessToken = authService.generateAccessToken(user._id, user.role);
      const refreshToken = authService.generateRefreshToken(user._id);

      await authService.updateRefreshToken(user._id, refreshToken);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        accessToken,
        refreshToken,
        message:
          "Registration successful. Your account is pending admin approval.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    const user = await authService.findUserByEmail(email);

    if (user && (await user.matchPassword(password))) {
      if (user.role === "chauffeur" && user.accountStatus !== "approved") {
        return res.status(403).json({
          message: "Your account is pending approval by admin",
          accountStatus: user.accountStatus,
        });
      }

      const accessToken = authService.generateAccessToken(user._id, user.role);
      const refreshToken = authService.generateRefreshToken(user._id);

      await authService.updateRefreshToken(user._id, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        accessToken,
        refreshToken,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const decoded = authService.verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await authService.findUserByEmail(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = authService.generateAccessToken(user._id, user.role);

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    await authService.clearRefreshToken(req.user._id);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await authService.findUserById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
