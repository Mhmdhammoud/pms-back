import express from 'express';
import {
	Login,
	Register,
	AddMilestone,
	AddTask,
	AddEmployee,
	CreateProject,
	GetManagerByID,
	getByIDandUpdate,
	FinalizeTask,
	ToggleTaskStatus,
	MyProjects,
	DeleteEmployee,
	RemoveEmployeeFromProject,
	AddTaskFile,
} from '../controllers/projectmanagers/index.js';
import {ManagerAuthValidator, ValidateID} from '../middleware/index.js';
const router = express.Router();

router.route('/login').post(Login);
router.route('/register').post(Register);
router
	.route('/addmilestone')
	.put(ManagerAuthValidator, ValidateID, AddMilestone);
router.route('/addTask').put(ManagerAuthValidator, ValidateID, AddTask);
router.route('/addEmployee').put(ManagerAuthValidator, ValidateID, AddEmployee);
router.route('/project/create').post(ManagerAuthValidator, CreateProject);
router.route('/getByID').get(ValidateID, GetManagerByID);
router.route('/update').put(ManagerAuthValidator, getByIDandUpdate);
router.route('/task/finalize').put(ManagerAuthValidator, FinalizeTask);
router.route('/task/toggle').put(ManagerAuthValidator, ToggleTaskStatus);
router.route('/projects/mine').get(ManagerAuthValidator, MyProjects);
router.route('/employee/delete').delete(ManagerAuthValidator, DeleteEmployee);
router
	.route('/project/employee/remove')
	.delete(ManagerAuthValidator, RemoveEmployeeFromProject);
router.route('/project/task/file').put(ManagerAuthValidator, AddTaskFile);
export default router;
