import {Project, Employee} from '../../../models/index.js';
import {RemoveEmployee} from '../../Constants/newsFeed.js';
import mongoose from 'mongoose';
export default async (req, res) => {
	try {
		const {employeeID: EMPLPOYEE_ID, projectID: PROJECT_ID} = req.query;
		if (!EMPLPOYEE_ID) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Employee ID was not found',
				requestTime: new Date().toISOString(),
			});
		}
		if (EMPLPOYEE_ID != mongoose.Types.ObjectId(EMPLPOYEE_ID)) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request,wrong employee id format ',
				requestTime: new Date().toISOString(),
			});
		}
		if (!PROJECT_ID) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Project ID was not found',
				requestTime: new Date().toISOString(),
			});
		}
		if (PROJECT_ID != mongoose.Types.ObjectId(PROJECT_ID)) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request,wrong project id format ',
				requestTime: new Date().toISOString(),
			});
		}
		const PROJECT = await Project.findById(PROJECT_ID).populate(
			'projectManager',
			'fullName'
		);

		const EMPLOYEE_TOBE_DELETED = PROJECT.projectEmployees.find(
			(el) => el.employeeID == EMPLPOYEE_ID
		);
		if (!EMPLOYEE_TOBE_DELETED) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Employee was Not Found',
				requestTime: new Date().toISOString(),
			});
		}
		const FILTERED_EMPLOYEES = PROJECT.projectEmployees.filter(
			(el) => el.employeeID != EMPLPOYEE_ID
		);
		const EMPLOYEE = await Employee.findById(EMPLPOYEE_ID);

		const UPDATED_PROJECT = await Project.findByIdAndUpdate(PROJECT_ID, {
			$set: {
				projectEmployees: FILTERED_EMPLOYEES,
			},
			$push: {
				news: {
					title: RemoveEmployee(
						PROJECT.projectManager.fullName,
						EMPLOYEE.fullName,
						PROJECT.title
					),
				},
			},
		});
		if (!UPDATED_PROJECT) {
			throw new Error('Internal Server Error');
		}
		const NEW_PROJECT = await Project.findById(PROJECT_ID)
			.select('-__v')
			.populate(
				'projectEmployees.employeeID',
				'image fullName email _id phone'
			);
		const {projects: EMPLOYEE_PROJECTS, tasks: EMPLOYEE_TASKS} = EMPLOYEE;
		let _filteredProjects = EMPLOYEE_PROJECTS.filter(
			(el) => el.project != PROJECT_ID
		);
		let _filteredTasks = EMPLOYEE_TASKS.filter(
			(el) => el.projectID != PROJECT_ID
		);
		const UPDATED_EMPLOYEE = await Employee.findByIdAndUpdate(
			EMPLPOYEE_ID,
			{
				$set: {
					projects: _filteredProjects,
					tasks: _filteredTasks,
				},
			}
		);

		return res.status(200).json({
			status: 'Success',
			message: 'Employee was removed from project successfully',
			project: NEW_PROJECT,
			updatedEmployee: UPDATED_EMPLOYEE,
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
