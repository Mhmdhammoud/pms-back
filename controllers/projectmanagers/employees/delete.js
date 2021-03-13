import {Employee} from '../../../models/index.js';
export default async (req, res) => {
	try {
		const {employeeID: EMPLOYEE_ID} = req.query;
		const EMPLOYEE = await Employee.findById(EMPLOYEE_ID);
		if (!EMPLOYEE) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Employee was not found',
				manager: null,
			});
		}
		const DELTED_EMPLOYEE = await Employee.findByIdAndDelete(EMPLOYEE_ID);
		if (DELTED_EMPLOYEE) {
			return res.status(200).json({
				status: 'Failure',
				message: 'Employee was deleted successfully',
				manager: null,
			});
		}
	} catch (error) {
		return res.status(500).json({
			status: 'Failure',
			message: 'Internal Server Error',
			message: error.message,
		});
	}
};
