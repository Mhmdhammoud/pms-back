import {Employee} from '../../../models/index.js';
export default async (req, res) => {
	try {
		const {id: EMPLOYEE_ID} = req.query;

		const THIS_EMPLOYEE = await Employee.findById(EMPLOYEE_ID).select(
			'-__v -password'
		);
		return res.status(200).json({
			status: 'Success',
			message: 'Employee was fetched successfully',
			employee: THIS_EMPLOYEE,
			requestTime: new Date().toISOString(),
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
		});
	}
};
