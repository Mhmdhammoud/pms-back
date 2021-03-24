import {
	getAllEmployees,
	getByID,
} from '../controllers/projectmanagers/employees/index.js';
import {getTasks, GetProjectBoard} from '../controllers/employee/index.js';
import {addComment} from '../controllers/projects/index.js';
import express from 'express';
import {GetTaskByID} from '../controllers/projectmanagers/index.js';
import {ValidateID} from '../middleware/index.js';
import {AddContact, GetContact} from '../controllers/utils/index.js';
const router = express.Router();
router.route('/employees/getAll').get(getAllEmployees);
router.route('/employees/getByID').get(ValidateID, getByID);
router.route('/employees/getTasks').get(getTasks);
router.route('/projects/addComment').put(addComment);
router.route('/project/task/getByID').get(GetTaskByID);
router.route('/project/board').get(GetProjectBoard);
router.route('/contact').post(AddContact);
router.route('/contact').get(GetContact);

export default router;
