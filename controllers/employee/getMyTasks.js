import {Project} from '../../models/index.js';
export default async (req, res) => {
	try {
		const {id: EMPLOYEE_ID} = req.user;
		const ALL_PROJECTS = await Project.find({})
			.populate(
				'projectEmployees.employeeID',
				'fullName image _id email phone'
			)
			.populate('tasks.employeeID', 'fullName image email _id phone')
			.populate('projectManager', 'fullName email phone image _id')
			.select('-__v');
		let MY_TASKS = [];
		ALL_PROJECTS.map((el) => {
			if (el.tasks.length !== 0) {
				let projectMyTasks = el.tasks.filter(
					(element) => element.employeeID._id == EMPLOYEE_ID
				);
				MY_TASKS.push(projectMyTasks);
			} else {
				return;
			}
		});

		if (projectMyTasks.length === 0) {
			return res.status(200).json({
				status: 'Status',
				message: 'You have no tasks yet',
				requestTime: new Date().toISOString(),
			});
		}
		return res.status(200).json({
			status: 'Success',
			message: 'Tasks were fetched successfully',
			tasks: projectMyTasks,
			length: projectMyTasks.length,
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
