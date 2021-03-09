import {Employee} from '../../../models/index.js';
export default async (req, res) => {
	try {
		const ALL_EMPLOYEES = await Employee.find({}).select('-__v -password');
		return res.status(200).json({
			status: 'Success',
			message: 'All employees were fetched successfully',
			employees: ALL_EMPLOYEES,
			requestTime: new Date().toISOString(),
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
		});
	}
};
