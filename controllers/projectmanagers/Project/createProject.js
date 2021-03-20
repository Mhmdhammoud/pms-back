import {Project, Manager} from '../../../models/index.js';

export default async (req, res) => {
	const {type} = req.user;

	if (!type === 'Manager') {
		return res.status(403).json({
			status: 'Failed',
			message: 'This route is only accepted to a certain clearance level',
		});
	}
	try {
		const {title, duration, startingDate, description} = req.body;
		const NewProject = await Project.create({
			title,
			duration,
			startingDate,
			projectManager: req.user.id,
			description,
		});
		if (NewProject) {
			const UPDATED_MANAGER = await Manager.findByIdAndUpdate(
				req.user.id,
				{
					$push: {
						projects: [{project: NewProject._id}],
					},
				}
			);
			const UPDATED_PROJECT = await Project.findByIdAndUpdate(
				NewProject._id,
				{
					$push: {
						news: [
							{
								title: `${NewProject.title} was created`,
							},
						],
					},
				}
			);
			if (UPDATED_MANAGER) {
				return res.status(200).json({
					status: 'Success',
					message: 'Project was created succsessully',
					requestTime: req.requestedAt,
					project: UPDATED_PROJECT,
				});
			} else {
				throw new Error('Internal Server Error');
			}
		}
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
		});
	}
};
