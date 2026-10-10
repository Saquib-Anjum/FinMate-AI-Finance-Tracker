import {Router} from 'express';
import { login, signup ,getMe} from '../controllers/userController.js';
import {protect} from '../middlewares/auth.js'
const userRouter = Router();
userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.get('/me',protect,getMe);
export default userRouter;