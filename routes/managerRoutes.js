import express from 'express';
import { Login, Register } from '../controllers/projectmanagers/index.js';
import ValidateAuth from '../middleware/ManagerAuthValidator.js';
const router = express.Router();

router.route('/login').post(Login);
router.route('/register').post(Register);
export default router;
