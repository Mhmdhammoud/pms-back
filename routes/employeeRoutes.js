import express from 'express';
import { EmployeeAuthValidator } from '../middleware/index.js';
import { Login, Register } from '../controllers/employee/index.js';
const router = express.Router();

router.route('/login').post(Login);
router.route('/register').post(Register);

export default router;
