import express from 'express';
import {EmployeeAuthValidator} from '../middleware/index.js';
import {Login, Register} from '../controllers/employee/index.js';
const router = express.Router();

router.route('/login').post(Login);
router.route('/register').post(Register);
router.route('/getTasks').get();
export default router;
