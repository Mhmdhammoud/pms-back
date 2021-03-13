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
		let MY_PROJECTS = [];
		let FIND;
		ALL_PROJECTS.map((el) => {
			if (el.tasks.length !== 0) {
				FIND = el.tasks.find(
					(element) => element.employeeID._id == EMPLOYEE_ID
				);
				FIND && MY_PROJECTS.push(el);
			} else {
				return;
			}
		});

		if (MY_PROJECTS.length === 0) {
			return res.status(200).json({
				status: 'Status',
				message: 'You have no projects yet',
				requestTime: new Date().toISOString(),
			});
		}
		return res.status(200).json({
			status: 'Success',
			message: 'Projects were fetched successfully',
			Projects: MY_PROJECTS,
			length: MY_PROJECTS.length,
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
