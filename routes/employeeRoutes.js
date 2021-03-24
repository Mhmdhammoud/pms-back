import express from 'express';
import {EmployeeAuthValidator} from '../middleware/index.js';
import {
	Login,
	Register,
	getByIDandUpdate,
	GetMyTasks,
	GetMyProjects,
	ToggleMyTaskStatus,
	AddTasKFile,
	ChangeProfileImage,
} from '../controllers/employee/index.js';
const router = express.Router();

router.route('/login').post(Login);
router.route('/register').post(Register);
router.route('/getTasks').get();
router.route('/update').put(EmployeeAuthValidator, getByIDandUpdate);
router.route('/projects/tasks/mine').get(EmployeeAuthValidator, GetMyTasks);
router.route('/projects/mine').get(EmployeeAuthValidator, GetMyProjects);
router.route('/task/toggle').put(EmployeeAuthValidator, ToggleMyTaskStatus);
router.route('/project/task/file').put(EmployeeAuthValidator, AddTasKFile);
router.route('/profile/image').put(EmployeeAuthValidator, ChangeProfileImage);
export default router;
