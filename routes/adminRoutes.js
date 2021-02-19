import express from 'express';
import { Login, Register, CreateProject } from '../controllers/admin/index.js';
import ValidateAuth from '../middleware/AdminAuthValidator.js';
const router = express.Router();

router.route('/login').get(Login);
router.route('/register').post(Register);
router.route('/project/create').post(ValidateAuth, CreateProject);
export default router;
