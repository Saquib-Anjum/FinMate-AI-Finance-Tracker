import {Router} from 'express';
import { createGoal, deleteGoal, getGoalById, getGoals, updateGoal } from '../controllers/goalController.js';
import {protect} from '../middlewares/auth.js'
const goalRouter = Router();
goalRouter.post('/create',protect,createGoal);
goalRouter.get('/get',protect,getGoals);
goalRouter.get('/get/:id',protect,getGoalById);
goalRouter.put('/update/:id',protect,updateGoal);
goalRouter.delete('/delete/:id',protect,deleteGoal);
export default goalRouter;