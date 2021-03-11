import {Employee, Manager, Project} from '../../models/index.js';
import mongoose from 'mongoose';
export default async (req, res) => {
	try {
		const {projectID: PROJECT_ID, taskID: TASK_ID} = req.query;
		const {
			commentText: COMMENT_TEXT,
			userType: USER_TYPE,
			userID: USER_ID,
		} = req.body;
		if (
			(!COMMENT_TEXT == COMMENT_TEXT) === '' ||
			!USER_ID ||
			USER_ID == ''
		) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, text error',
				requestTime: new Date().toISOString(),
			});
		}
		if (!PROJECT_ID || PROJECT_ID == '' || !TASK_ID || TASK_ID == '') {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, project ID || task ID was not found',
				requestTime: new Date().toISOString(),
			});
		} else if (
			PROJECT_ID != mongoose.Types.ObjectId(PROJECT_ID) ||
			TASK_ID != mongoose.Types.ObjectId(TASK_ID) ||
			USER_ID != mongoose.Types.ObjectId(USER_ID)
		) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, wrong project ID || task ID format',
				requestTime: new Date().toISOString(),
			});
		}

		switch (USER_TYPE) {
			case 'Manager':
				let PROJECT = await Project.findById(PROJECT_ID);
				const MANAGER = await Manager.findById(USER_ID);
				if (!MANAGER) {
					return res.status(404).json({
						status: 'Failure',
						message: 'Manager was not found',
						requestTime: new Date().toISOString(),
					});
				}
				const {fullName: USER_NAME, image: USER_IMAGE} = MANAGER;

				if (PROJECT.projectManager != USER_ID) {
					return res.status(403).json({
						status: 'Failure',
						message: 'Not authorized',
						requestTime: new Date().toISOString(),
					});
				}
				const {tasks: ALL_TASKS} = PROJECT;
				let TASK = ALL_TASKS.find((el) => el._id == TASK_ID);
				let ALL_OTHER_TASKS = ALL_TASKS.filter(
					(el) => el._id != TASK_ID
				);

				if (!TASK) {
					return res.status(404).json({
						status: 'Failure',
						message: 'Task was not found',
						requestTime: new Date().toISOString(),
					});
				}

				let UPDATED_TASK = {
					...TASK,
					taskTitle: TASK.taskTitle,
					employeeID: TASK.employeeID,
					duration: TASK.duration,
					deadline: TASK.deadline,
					startingDate: TASK.startingDate,
					files: TASK.files,
					status: TASK.status,
					comments: [
						...TASK.comments,
						{
							text: COMMENT_TEXT,
							ownerName: USER_NAME,
							onwerImage: USER_IMAGE,
						},
					],
				};
				ALL_OTHER_TASKS.push(UPDATED_TASK);
				let ALL_UPDATED_TASKS = ALL_OTHER_TASKS;
				const UPDATED_PROJECT = await Project.findByIdAndUpdate(
					PROJECT_ID,
					{
						$set: {
							tasks: ALL_UPDATED_TASKS,
						},
					},
					{
						new: true,
					}
				);

				if (UPDATED_PROJECT) {
					return res.status(200).json({
						status: 'Success',
						message: 'Comment was added successfully',
						project: UPDATED_PROJECT,
						requestTime: new Date().toISOString(),
					});
				} else {
					throw new Error('Internal Server Error');
				}
			case 'Employee':
				PROJECT = await Project.findById(PROJECT_ID);
				const EMPLOYEE = await Employee.findById(USER_ID);
				if (!EMPLOYEE) {
					return res.status(404).json({
						status: 'Failure',
						message: 'EMPLOYEE was not found',
						requestTime: new Date().toISOString(),
					});
				}
				const {
					fullName: EMPLOYEE_NAME,
					image: EMPLOYEE_IMAGE,
				} = EMPLOYEE;

				const FOUND = PROJECT.projectEmployees.find(
					(el) => el.employeeID == USER_ID
				);
				if (!FOUND) {
					return res.status(403).json({
						status: 'Failure',
						message: 'Not authorized',
						requestTime: new Date().toISOString(),
					});
				}

				const {tasks: allTasks} = PROJECT;
				TASK = allTasks.find((el) => el._id == TASK_ID);
				ALL_OTHER_TASKS = allTasks.filter((el) => el._id != TASK_ID);

				if (!TASK) {
					return res.status(404).json({
						status: 'Failure',
						message: 'Task was not found',
						requestTime: new Date().toISOString(),
					});
				}

				UPDATED_TASK = {
					...TASK,
					taskTitle: TASK.taskTitle,
					employeeID: TASK.employeeID,
					duration: TASK.duration,
					deadline: TASK.deadline,
					startingDate: TASK.startingDate,
					files: TASK.files,
					comments: [
						...TASK.comments,
						{
							text: COMMENT_TEXT,
							ownerName: EMPLOYEE_NAME,
							onwerImage: EMPLOYEE_IMAGE,
						},
					],
				};
				ALL_OTHER_TASKS.push(UPDATED_TASK);
				ALL_UPDATED_TASKS = ALL_OTHER_TASKS;
				const EMPLOYEE_UPDATED_PROJECT = await Project.findByIdAndUpdate(
					PROJECT_ID,
					{
						$set: {
							tasks: ALL_UPDATED_TASKS,
						},
					},
					{
						new: true,
					}
				);

				if (EMPLOYEE_UPDATED_PROJECT) {
					return res.status(200).json({
						status: 'Success',
						message: 'Comment was added successfully',
						project: EMPLOYEE_UPDATED_PROJECT,
						requestTime: new Date().toISOString(),
					});
				} else {
					throw new Error('Internal Server Error');
				}
			default:
				return res.status(403).json({
					status: 'Failure',
					message: 'No authorized',
					requestTime: new Date().toISOString(),
				});
		}
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
		});
	}
};
