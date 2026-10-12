
import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import {
  getSetting,
  updateSettings,
} from "../controllers/settingController.js";

const settingsRouter = Router();

settingsRouter.get("/", protect, getSetting);
settingsRouter.patch("/", protect, updateSettings);

export default settingsRouter;
