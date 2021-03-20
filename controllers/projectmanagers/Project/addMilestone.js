import {Manager, Project} from '../../../models/index.js';
import {NewMileStone} from '../Constants/newsFeed.js';
export default async (req, res) => {
	try {
		const {msTitle, endingDate} = req.body;
		if (!msTitle || !endingDate || msTitle === '' || endingDate === '') {
			return res.status(400).json({
				status: 'Failure',
				message: 'Expected msTitle & endingDate',
				requestTime: req.requestedAt,
			});
		}
		const MANAGER = await Manager.findById(req.user.id);
		await Project.findByIdAndUpdate(req.id, {
			$push: {
				milestones: {
					msTitle: msTitle,
					endingDate: endingDate,
				},
				news: {
					title: NewMileStone(MANAGER.fullName, msTitle),
				},
			},
		});
		const UpdatedProject = await Project.findById(req.id)
			.select('-__v -updatedAt -createdAt')
			.populate('projectManager', 'fullName email image')
			.populate('projectEmployees.employeeID', 'fullName email image')
			.populate('tasks.employeeID', 'fullName image email');
		return res.status(200).json({
			status: 'Success',
			message: 'Project was updated successfully, milestone was added',
			milestone: {
				msTitle,
				endingDate,
			},
			project: UpdatedProject,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
			requestTime: req.requestedAt,
		});
	}
};
