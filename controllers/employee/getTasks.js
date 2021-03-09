import {Employee, Project} from '../../models/index.js';

export default async (req, res) => {
	try {
		const {employeeID, projectID} = req.query;
		const PROJECT = await Project.findById(projectID).populate(
			'tasks.employeeID',
			'fullName image email _id'
		);
		if (PROJECT.tasks.length !== 0) {
			const {tasks: ALL_TASKS} = PROJECT;
			const FILTERED_TASKS = ALL_TASKS.filter(
				(el) => el.employeeID._id == employeeID
			);
			return res.status(400).json({
				status: 'Success',
				message: 'Employee tasks were fetched successfully',
				tasks: FILTERED_TASKS,
				requestTime: new Date().toISOString(),
			});
		} else {
			return res.status(400).json({
				status: 'Success',
				message: 'This project got no tasks ',
				project: PROJECT,
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
