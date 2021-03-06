import {getAllEmployees} from '../controllers/projectmanagers/employees/index.js';
import express from 'express';
const router = express.Router();
router.route('/employees/getAll').get(getAllEmployees);
export default router;
