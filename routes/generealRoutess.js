import {
	getAllEmployees,
	getByID,
} from '../controllers/projectmanagers/employees/index.js';
import express from 'express';
import {ValidateID} from '../middleware/index.js';
const router = express.Router();
router.route('/employees/getAll').get(getAllEmployees);
router.route('/employees/getByID').get(ValidateID, getByID);
export default router;
