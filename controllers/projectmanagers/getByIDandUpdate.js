import {Manager} from '../../models/index.js';
export default async (req, res) => {
	try {
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
		});
	}
};
