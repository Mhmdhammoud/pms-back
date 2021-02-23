import express from 'express';
import {
  Login,
  Register,
  AddMilestone,
  AddTask,
} from '../controllers/projectmanagers/index.js';
import { ManagerAuthValidator, ValidateID } from '../middleware/index.js';
const router = express.Router();

router.route('/login').post(Login);
router.route('/register').post(Register);
router
  .route('/addmilestone')
  .put(ManagerAuthValidator, ValidateID, AddMilestone);
router.route('/addTask').put(ManagerAuthValidator, ValidateID, AddTask);
export default router;
