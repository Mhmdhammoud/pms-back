import mongoose from 'mongoose';
export default async (req, res, next) => {
	try {
		const {id} = req.query;
		if (!id) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, expected  ID recieved null',
			});
		} else if (id != mongoose.Types.ObjectId(id)) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, wrong  id format',
			});
		}

		req.id = id;
		next();
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
		});
	}
};
