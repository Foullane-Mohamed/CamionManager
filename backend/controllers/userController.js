import * as authService from "../services/authService.js";
import { validateApproval } from "../validators/authValidator.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await authService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingChauffeurs = async (req, res) => {
  try {
    const pendingUsers = await authService.getPendingChauffeurs();
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAccountStatus = async (req, res) => {
  try {
    const { error } = validateApproval(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { accountStatus } = req.body;
    const userId = req.params.id;

    const user = await authService.updateAccountStatus(userId, accountStatus);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: `Account ${accountStatus} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await authService.findUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await authService.findUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
