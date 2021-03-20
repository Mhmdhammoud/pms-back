import {Project} from '../../../models/index.js';
import {ToggleTask} from '../Constants/newsFeed.js';
import mongoose from 'mongoose';
export default async (req, res) => {
	try {
		const {
			projectID: PROJECT_ID,
			taskID: TASK_ID,
			status: NEW_TASK_STATUS,
		} = req.query;
		if (
			!PROJECT_ID ||
			PROJECT_ID == '' ||
			PROJECT_ID != mongoose.Types.ObjectId(PROJECT_ID)
		) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, Project ID format ',
				requestTime: new Date().toISOString(),
			});
		}
		if (
			!TASK_ID ||
			TASK_ID == '' ||
			TASK_ID != mongoose.Types.ObjectId(TASK_ID)
		) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, Task ID format ',
				requestTime: new Date().toISOString(),
			});
		}

		if (!NEW_TASK_STATUS) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Bad request,New task was not found',
				requestTime: new Date().toISOString(),
			});
		}
		let NEW_STATUS;
		switch (NEW_TASK_STATUS) {
			case '1':
				NEW_STATUS = 'TO-DO';
				break;
			case '2':
				NEW_STATUS = 'In-Progress';
				break;
			case '3':
				NEW_STATUS = 'Done';
				break;
			default:
				return res.status(400).json({
					status: 'Failure',
					message: 'Bad request, New status can only accept 1 | 2 |3',
					requestTime: new Date().toISOString(),
				});
		}
		const PROJECT = await Project.findById(PROJECT_ID).populate(
			'projectManager',
			'fullName'
		);
		const {tasks: ALL_OUTDATED_TASKS} = PROJECT;
		let TASK = ALL_OUTDATED_TASKS.find((el) => el._id == TASK_ID);
		if (!TASK) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Task was not found',
				requestTime: new Date().toISOString(),
			});
		}
		let ALL_OTHER_TASKS = ALL_OUTDATED_TASKS.filter(
			(el) => el._id != TASK_ID
		);
		let UPDATED_TASK = {
			title: TASK.title,
			employeeID: TASK.employeeID,
			duration: TASK.duration,
			deadline: TASK.deadline,
			startingDate: TASK.startingDate,
			description: TASK.description,
			comments: TASK.comments,
			status: NEW_STATUS,
		};
		ALL_OTHER_TASKS.push(UPDATED_TASK);
		let ALL_UPDATED_TASKS = ALL_OTHER_TASKS;
		const UPDATED_PROJECT = await Project.findByIdAndUpdate(
			PROJECT_ID,
			{
				$set: {
					tasks: ALL_UPDATED_TASKS,
				},
				$push: {
					news: {
						title: ToggleTask(
							TASK.title,
							TASK.status,
							NEW_STATUS,
							PROJECT.projectManager.fullName
						),
					},
				},
			},
			{
				new: true,
			}
		);
		const {tasks: ALL_UPDATED_PROJECTS_NEW} = UPDATED_PROJECT;
		const TODO_TASKS = ALL_UPDATED_PROJECTS_NEW.filter(
			(el) => el.status == 'TO-DO'
		);
		const INPROGRESS_TASKS = ALL_UPDATED_PROJECTS_NEW.filter(
			(el) => el.status == 'In-Progress'
		);
		const DONE_TASKS = ALL_UPDATED_PROJECTS_NEW.filter(
			(el) => el.status == 'Done'
		);
		return res.status(200).json({
			status: 'Success',
			message: 'Task was updated successfully',
			tasks: UPDATED_PROJECT.tasks,
			todoTasks: TODO_TASKS,
			inProgressTasks: INPROGRESS_TASKS,
			doneTasks: DONE_TASKS,
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
