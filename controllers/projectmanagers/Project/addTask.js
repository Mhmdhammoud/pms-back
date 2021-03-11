import {Project, Employee} from '../../../models/index.js';
import mongoose from 'mongoose';
export default async (req, res) => {
	try {
		const {
			taskTitle,
			employeeID,
			duration,
			deadline,
			startingDate,
			description,
		} = req.body;
		if (
			!taskTitle ||
			!employeeID ||
			taskTitle === '' ||
			employeeID === '' ||
			!duration ||
			!deadline ||
			!startingDate ||
			duration === '' ||
			deadline === '' ||
			startingDate === '' ||
			!description ||
			description === ''
		) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Expected msTitle & endingDate',
				requestTime: req.requestedAt,
			});
		} else if (req.id != mongoose.Types.ObjectId(req.id)) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, wrong employee id format',
				requestTime: req.requestedAt,
			});
		}
		await Project.findByIdAndUpdate(req.id, {
			$push: {
				tasks: {
					taskTitle,
					employeeID,
					duration,
					deadline,
					startingDate,
					description,
				},
			},
		});
		const UpdatedProject = await Project.findById(req.id)
			.select('-__v -updatedAt -createdAt')
			.populate('projectManager', 'fullName email image')
			.populate('projectEmployees.employeeID', 'fullName email image')
			.populate('tasks.employeeID', 'fullName image email');
		const UPDATED_EMPLOYEE = await Employee.findByIdAndUpdate(employeeID, {
			$push: {
				tasks: [
					{
						title: taskTitle,
						projectTitle: UpdatedProject.title,
						deadline: deadline,
					},
				],
			},
		});
		if (UPDATED_EMPLOYEE) {
			return res.status(200).json({
				status: 'Success',
				message: 'Project was updated successfully, Task was added',
				task: {
					taskTitle,
					employeeID,
					duration,
					deadline,
					startingDate,
					description,
				},
				project: UpdatedProject,
			});
		} else {
			throw new Error('Internal Server Error');
		}
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
		});
	}
};
