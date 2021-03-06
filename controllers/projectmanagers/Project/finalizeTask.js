import {Project, Manager} from '../../../models/index.js';
import {FinalizeTask} from '../../Constants/newsFeed.js';
export default async (req, res) => {
	try {
		const {type: USER_TYPE} = req.user;
		const {projectID: PROJECT_ID, taskID: TASK_ID} = req.query;
		if (!PROJECT_ID) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, Project manager was not found.',
				requestTime: new Date().toISOString(),
			});
		}
		if (USER_TYPE != 'Manager') {
			return res.status(403).json({
				status: 'Failure',
				message: 'Not Authorized',
				requestTime: new Date().toISOString(),
			});
		}
		const PROJECT = await Project.findById(PROJECT_ID).populate(
			'projectManager',
			'fullName'
		);
		const {tasks: ALL_TASKS} = PROJECT;
		let TASK = ALL_TASKS.find((el) => el._id == TASK_ID);
		let ALL_OTHER_TASKS = ALL_TASKS.filter((el) => el._id != TASK_ID);
		if (!TASK) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Not Found, task was not found',
				requestTime: new Date().toISOString(),
			});
		}
		let UPDATED_TASK = {
			...TASK,
			title: TASK.title,
			employeeID: TASK.employeeID,
			duration: TASK.duration,
			deadline: TASK.deadline,
			startingDate: TASK.startingDate,
			files: TASK.files,
			description: TASK.description,
			status: 'Done',
			comments: TASK.comments,
			managerFiles: TASK.managerFiles,
			employeeFiles: TASK.employeeFiles,
		};
		ALL_OTHER_TASKS.push(UPDATED_TASK);
		let ALL_UPDATED_TASKS = ALL_OTHER_TASKS;
		const UPDATED_PROJECT = await Project.findByIdAndUpdate(
			PROJECT_ID,
			{
				$set: {
					tasks: ALL_UPDATED_TASKS,
				},
				$push: {
					news: {
						title: FinalizeTask(
							TASK.title,
							PROJECT.projectManager.fullName
						),
					},
				},
			},
			{
				new: true,
			}
		);
		return res.status(200).json({
			status: 'Success',
			message: 'Task status was changed successfully',
			project: UPDATED_PROJECT,
			requestTime: new Date().toISOString(),
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
			requestTime: new Date().toISOString(),
		});
	}
};
