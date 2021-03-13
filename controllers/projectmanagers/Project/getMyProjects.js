import {Project} from '../../../models/index.js';

export default async (req, res) => {
	try {
		const {id: MANAGER_ID} = req.user;
		const ALL_PROJECTS = await Project.find({})
			.populate(
				'projectEmployees.employeeID',
				'fullName image _id email phone'
			)
			.populate('tasks.employeeID', 'fullName image email _id phone')
			.select('-__v');
		const MY_PROJECTS = ALL_PROJECTS.filter(
			(el) => el.projectManager == MANAGER_ID
		);
		if (MY_PROJECTS.length === 0) {
			return res.status(200).json({
				status: 'Status',
				message: 'No projects were found',
				requestTime: new Date().toISOString(),
			});
		}
		return res.status(200).json({
			status: 'Success',
			message: 'Projects were fetched successfully',
			projects: MY_PROJECTS,
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
