import {Router} from 'express';
import { protect } from '../middlewares/auth.js';
import { deleteProfile, getProfile, updateProfile } from '../controllers/profileController.js';
const profileRouter =Router();
profileRouter.get('/get',protect,getProfile);
profileRouter.put('/update/:id',protect,updateProfile);
profileRouter.delete('/delete/:id',protect,deleteProfile)
export default profileRouter;