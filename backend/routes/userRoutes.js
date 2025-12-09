import express from "express";
import {
  getAllUsers,
  getPendingChauffeurs,
  updateAccountStatus,
  getUserById,
  deleteUser,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();


router.use(protect);
router.use(adminOnly);

router.get("/", getAllUsers);
router.get("/pending", getPendingChauffeurs);
router.get("/:id", getUserById);
router.put("/:id/approve", updateAccountStatus);
router.delete("/:id", deleteUser);

export default router;
