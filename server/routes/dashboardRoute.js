import {Router} from 'express';
import { protect } from '../middlewares/auth.js';
import {dashboardData} from '../controllers/dashboardController.js'
const dashboardRouter = Router();
dashboardRouter.get('/get',protect,dashboardData)
export default dashboardRouter;