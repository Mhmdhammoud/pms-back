import express from 'express';
import { Login, Register } from '../controllers/admin/index.js';
const router = express.Router();

router.route('/login').get(Login);
router.route('/register').post(Register);
export default router;
