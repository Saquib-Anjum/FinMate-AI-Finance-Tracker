import {Router} from 'express';
import {protect} from '../middlewares/auth.js'
import { askAi } from '../controllers/aiAssisantController.js';
const aiRouter = Router();
aiRouter.post('/',protect,askAi)
export default aiRouter;