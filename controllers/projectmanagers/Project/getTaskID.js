import {Project} from '../../../models/index.js';
import mongoose from 'mongoose';
export default async (req, res) => {
	try {
		const {projectID: PROJECT_ID, taskID: TASK_ID} = req.query;

		if (!PROJECT_ID || PROJECT_ID != mongoose.Types.ObjectId(PROJECT_ID)) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, Wrong project ID format',
				requestTime: new Date().toISOString(),
			});
		}
		if (!TASK_ID || TASK_ID != mongoose.Types.ObjectId(TASK_ID)) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, Wrong task ID format',
				requestTime: new Date().toISOString(),
			});
		}
		const PROJECT = await Project.findById(PROJECT_ID);
		if (!PROJECT) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Project was not found , Not Found',
				requestTime: new Date().toISOString(),
			});
		}
		const {tasks: ALL_TASKS} = PROJECT;
		const TASK = ALL_TASKS.find((el) => el._id == TASK_ID);
		if (!TASK) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Task was not found',
				requestTime: new Date().toISOString(),
			});
		} else {
			let _allComments = [];
			let _filteredComments = [];

			TASK.employeesComments.map((employeElement) => {
				_allComments.push(employeElement);
			});
			TASK.managerComments.map((managerElement) => {
				_allComments.push(managerElement);
			});
			_allComments.map((element) => {
				if (element.manager) {
					_filteredComments.push({
						_id: element._id,
						text: element.text,
						user: {
							fullName: element.manager.fullName,
							_id: element.manager._id,
							image: element.manager.image,
						},
					});
				} else {
					_filteredComments.push({
						_id: element._id,
						text: element.text,
						user: {
							fullName: element.employee.fullName,
							_id: element.employee._id,
							image: element.employee.image,
						},
					});
				}
			});
			let _filteredTask = {
				title: TASK.title,
				description: TASK.description,
				employeeID: TASK.employeeID,
				duration: TASK.duration,
				deadline: TASK.deadline,
				startingDate: TASK.startingDate,
				files: TASK.files,
				comments: _allComments,
			};

			_allComments = [];
			_filteredComments = [];
			console.log(_filteredTask);

			return res.status(200).json({
				status: 'Success',
				message: 'Task was retrieved successfully',
				task: TASK,
				requestTime: new Date().toISOString(),
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
			requestTime: new Date().toISOString(),
		});
	}
};
