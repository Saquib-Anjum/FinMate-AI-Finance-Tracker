import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import {
  deleteProfile,
  getProfile,
  updateProfile,
} from "../controllers/profileController.js";
import upload from "../middlewares/upload.js";
const profileRouter = Router();
profileRouter.get("/get", protect, getProfile);
profileRouter.put("/update", protect, upload.single("avatar"), updateProfile);
profileRouter.delete("/delete", protect, deleteProfile);
export default profileRouter;
