import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import {
  changeName,
  changePassword,
  deleteAccount,
} from "../controllers/accountController.js";

const accountRouter = Router();

accountRouter.patch("/change-password", protect, changePassword);
accountRouter.patch("/change-name", protect, changeName);
accountRouter.delete("/delete-account", protect, deleteAccount);

export default accountRouter;
