import {Project} from '../../models/index.js';
import mongoose from 'mongoose';
export default async (req, res) => {
	try {
		const {projectID: PROJECT_ID} = req.query;
		if (!PROJECT_ID) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Project ID was not found',
				requestTime: new Date().toISOString(),
			});
		}
		if (PROJECT_ID != mongoose.Types.ObjectId(PROJECT_ID)) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, wrong Project ID format',
				requestTime: new Date().toISOString(),
			});
		}
		const PROJECT = await Project.findById(PROJECT_ID);
		if (!PROJECT) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Project was not Found',
				requestTime: new Date().toISOString(),
			});
		}
		const {tasks: ALL_TASKS} = PROJECT;
		if (ALL_TASKS.length === 0) {
			return res.status(400).json({
				status: 'Failure',
				message: `Project with ID ${PROJECT_ID} has no tasks yet`,
				requestTime: new Date().toISOString(),
			});
		}
		const TODO_TASKS = ALL_TASKS.filter((el) => el.status == 'TO-DO');
		const INPROGRESS_TASKS = ALL_TASKS.filter(
			(el) => el.status == 'In-Progress'
		);
		const DONE_TASKS = ALL_TASKS.filter((el) => el.status == 'Done');
		return res.status(200).json({
			status: 'Success',
			message: 'Project board was retrieved successfully',
			todoTasks: TODO_TASKS,
			inProgressTasks: INPROGRESS_TASKS,
			doneTasks: DONE_TASKS,
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
