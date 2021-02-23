import express from 'express';
import { Login, Register, CreateProject } from '../controllers/admin/index.js';
import { AdminAuthValidator } from '../middleware/index.js';
const router = express.Router();

router.route('/login').post(Login);
router.route('/register').post(Register);
router.route('/project/create').post(AdminAuthValidator, CreateProject);
export default router;
