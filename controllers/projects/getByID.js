import {Project} from '../../models/index.js';
export default async (req, res) => {
	try {
		const PROJECT = await Project.findById(req.id)
			.select('-__v')
			.populate('projectManager', 'fullName email image')
			.populate(
				'projectEmployees.employeeID',
				'fullName email image phone createdAt projects updatedAt'
			)
			.populate(
				'tasks.employeesComments.employee',
				' fullName email image phone _id'
			)
			.populate(
				'tasks.managerComments.manager',
				'fullName email image  _id'
			)
			.populate('tasks.employeeID', 'fullName image email')
			.populate(
				'tasks.managerFiles.manager',
				'fullName image email _id phone'
			)
			.populate(
				'tasks.employeeID.employee',
				'fullName image email _id phone'
			);

		if (!PROJECT) {
			return res.status(404).json({
				status: 'Success',
				message: 'Project was not found',
				ID: req.id,
				requestTime: req.requestedAt,
				project: null,
			});
		}
		let _allComments = [];
		let _filteredTasks = [];
		let _filteredComments = [];

		const {tasks: ALL_TASKS} = PROJECT;
		ALL_TASKS.map((el) => {
			el.employeesComments.map((employeElement) => {
				_allComments.push(employeElement);
			});
			el.managerComments.map((managerElement) => {
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
			_filteredTasks.push({
				title: el.title,
				description: el.description,
				employeeID: el.employeeID,
				duration: el.duration,
				deadline: el.deadline,
				startingDate: el.startingDate,
				files: el.files,
				_id: el._id,
				comments: _filteredComments,
				status: el.status,
				managerFiles: el.managerFiles,
				employeeFiles: el.employeeFiles,
			});

			_allComments = [];
			_filteredComments = [];
		});

		const {
			title,
			image,
			duration,
			startingDate,
			projectManager,
			projectEmployees,
			milestones,
			createdAt,
			UpdatedAt,
			news,
		} = PROJECT;

		return res.status(200).json({
			status: 'Success',
			message: 'Project was fetched successfully',
			project: {
				image,
				title,
				duration,
				startingDate,
				projectManager,
				projectEmployees,
				milestones,
				createdAt,
				UpdatedAt,
				tasks: _filteredTasks,
				news,
			},
			requestTime: req.requestedAt,
		});
	} catch (error) {
		return res.status(500).json({
			status: 'Error',
			message: 'Internal Server Error',
			error: error.message,
			requestTime: req.requestedAt,
		});
	}
};
