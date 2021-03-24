import {Project} from '../../../models/index.js';
import mongoose from 'mongoose';
import AWS from 'aws-sdk';
import multer from 'multer';
export default async (req, res) => {
	try {
		const {id: MANAGER_ID} = req.user;
		const {projectID: PROJECT_ID, taskID: TASK_ID} = req.query;
		if (!PROJECT_ID) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Project ID was not Found',
				requestTime: new Date().toISOString(),
			});
		}
		if (PROJECT_ID != mongoose.Types.ObjectId(PROJECT_ID)) {
			throw new Error('Wrong Project ID format');
		}
		if (!TASK_ID) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Task ID was not found',
				requestTime: new Date().toISOString(),
			});
		}
		if (TASK_ID != mongoose.Types.ObjectId(TASK_ID)) {
			throw new Error('Wrong task ID format');
		}
		const PROJECT = await Project.findById(PROJECT_ID).populate(
			'projectManager',
			'fullName _id'
		);
		if (PROJECT.projectManager._id != MANAGER_ID) {
			return res.status(403).json({
				status: 'Failure',
				message: 'Not Authorized',
				requestTime: new Date().toISOString(),
			});
		}

		let currentTask = PROJECT.tasks.find((el) => el._id == TASK_ID);

		const ALL_OTHER_PROJECT_TASKS = PROJECT.tasks.filter(
			(el) => el._id != TASK_ID
		);

		// AWS Upload starts here

		let dir = `PMS/projects/${PROJECT_ID}/tasks`;

		let upload = multer().single('taskFile');
		upload(req, res, function (err) {
			if (err instanceof multer.MulterError) {
				console.log('Multer Error Occured when uploading : ' + err);
				return err;
			} else if (err) {
				// An unknown error occurred when uploading.
				console.log('error while uploading lecture : ' + err);
				return err;
			}
			const s3 = new AWS.S3({
				accessKeyId: process.env.AWS_ACESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			});

			const params = {
				Bucket: process.env.BUCKET_NAME,
				Key: `${dir}/${req.files.taskFile.name}`,
				Body: req.files.taskFile.data,
				ContentType: req.files.taskFile.mimetype,
				ContentEncoding: req.files.taskFile.encoding,
			};
			s3.upload(params, (err, data) => {
				if (err) {
					console.log('error in upload Task file' + err);
				} else {
					console.log('Uploaded Task file');
				}
			});
		});

		// AWS Upload ends here

		let updatedTask = {
			title: currentTask.title,
			description: currentTask.description,
			status: currentTask.status,
			employeeID: currentTask.employeeID,
			duration: currentTask.duration,
			deadline: currentTask.deadline,
			managerComments: currentTask.managerComments,
			employeesComments: currentTask.employeesComments,
			startingDate: currentTask.startingDate,
			managerFiles: [
				...currentTask.managerFiles,
				{
					src: `${dir}/${req.files.taskFile.name}`,
					fileName: req.files.taskFile.name,
					manager: MANAGER_ID,
				},
			],
			employeeFiles: currentTask.employeeFiles,
		};
		let allOtherTasks = ALL_OTHER_PROJECT_TASKS;

		allOtherTasks.push(updatedTask);

		const UPDATED_PROJECT = await Project.findByIdAndUpdate(PROJECT_ID, {
			$set: {
				tasks: allOtherTasks,
			},
		})
			.populate('projetManager', 'fullName _id image email phone')
			.populate(
				'projectEmployees.employeeID',
				'fullName email _id phone image'
			)
			.populate(
				'tasks.employeeID',
				'fullName image fullName _id email phone'
			)
			.populate('tasks.managerComments', 'fullName image _id email')
			.populate('tasks.employeesComments', 'fullName image _id email')
			.populate('tasks.employeeFiles', 'fullName image _id email')
			.populate('tasks.managerFiles', 'fullName image _id email');
		const USELESS_PROJECT = await Project.findById(PROJECT_ID).select(
			'-__v'
		);
		const {tasks: USELESS_TASKS} = USELESS_PROJECT;
		const USELESS_TASK = USELESS_TASKS.find(
			(el) => el.title === updatedTask.title
		);
		const {_id: NEW_TASK_ID} = USELESS_TASK;

		return res.status(200).json({
			status: 'Success',
			message: 'Task file was uploaded successfully',
			project: UPDATED_PROJECT,
			newTaskID: NEW_TASK_ID,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
			requestTime: new Date().toISOString(),
		});
	}
};
