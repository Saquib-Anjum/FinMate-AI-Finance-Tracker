import {Router} from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middlewares/auth.js';
const analyticsRouter = Router();
analyticsRouter.get("/",protect,getAnalytics);
export default analyticsRouter;