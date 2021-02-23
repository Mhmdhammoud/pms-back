import express from 'express';
import {
  Login,
  Register,
  CreateProject,
  DeleteManager,
  DeleteEmployee,
  ViewUsers,
} from '../controllers/admin/index.js';
import { AdminAuthValidator } from '../middleware/index.js';
const router = express.Router();

router.route('/login').post(Login);
router.route('/register').post(Register);
router.route('/project/create').post(AdminAuthValidator, CreateProject);
router.route('/manager/delete').delete(AdminAuthValidator, DeleteManager);
router.route('/employee/delete').delete(AdminAuthValidator, DeleteEmployee);
router.route('/users').get(AdminAuthValidator, ViewUsers);
export default router;
