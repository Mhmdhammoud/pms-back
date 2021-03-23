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
		const PROJECT = await Project.findById(PROJECT_ID)
			.populate(
				'tasks.employeesComments.employee',
				' fullName email image phone _id'
			)
			.populate(
				'tasks.managerComments.manager',
				'fullName email image  _id'
			)
			.populate('tasks.employeeID', 'fullName image _id phone email')
			.populate(
				'tasks.managerFiles.manager',
				'fullName image email phone _id'
			)
			.populate(
				'tasks.employeeFiles.employee',
				'fullName image _id phone email'
			);
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
						type: 'Manager',
						createdAt: element.createdAt,
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
						type: 'Employee',
						createdAt: element.createdAt,
						user: {
							fullName: element.employee.fullName,
							_id: element.employee._id,
							image: element.employee.image,
						},
					});
				}
			});
			_filteredComments.sort((a, b) => a.createdAt - b.createdAt);

			let _filteredTask = {
				_id: TASK._id,
				title: TASK.title,
				description: TASK.description,
				employeeID: TASK.employeeID,
				duration: TASK.duration,
				deadline: TASK.deadline,
				startingDate: TASK.startingDate,
				files: TASK.files,
				comments: _filteredComments,
				managerFiles: TASK.managerFiles,
				employeeFiles: TASK.employeeFiles,
				status: TASK.status,
			};

			_allComments = [];
			_filteredComments = [];

			return res.status(200).json({
				status: 'Success',
				message: 'Task was retrieved successfully',
				task: _filteredTask,
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
