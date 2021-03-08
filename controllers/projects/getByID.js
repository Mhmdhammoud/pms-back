import {Project} from '../../models/index.js';
export default async (req, res) => {
	try {
		const PROJECT = await Project.findById(req.id)
			.select('-__v -updatedAt -createdAt')
			.populate('projectManager', 'fullName email image')
			.populate(
				'projectEmployees.employeeID',
				'fullName email image phone createdAt projects updatedAt'
			)
			.populate('tasks.employeeID', 'fullName image email');
		if (!PROJECT) {
			return res.status(404).json({
				status: 'Success',
				message: 'Project was not found',
				ID: req.id,
				requestTime: req.requestedAt,
				project: null,
			});
		}
		return res.status(200).json({
			status: 'Success',
			message: 'Project was fetched successfully',
			project: PROJECT,
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
