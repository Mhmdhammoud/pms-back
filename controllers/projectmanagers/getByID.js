import {Manager} from '../../models/index.js';
import Logger from '../../utils/logger.js';
export default async (req, res) => {
	const logger = new Logger();
	try {
		const MANAGER_ID = req.id;
		const MANAGER = await Manager.findById(MANAGER_ID)
			.select('-__v')
			.populate(
				'projects.project',
				'title duration description startingDate image _id'
			);
		if (MANAGER) {
			return res.status(200).json({
				status: 'Success',
				message: 'Manager profile was fetched successfully',
				manager: MANAGER,
				requestTime: new Date().toISOString(),
			});
		} else {
			return res.status(404).json({
				status: 'Failure',
				message: 'Manager was not found',
				manager: null,
				requestTime: new Date().toISOString(),
			});
		}
	} catch (error) {
		logger.errorLog(req.originalUrl, error.message);
		return res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
		});
	}
};
