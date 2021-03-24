import {Contact} from '../../models/index.js';
import Logger from '../../utils/logger.js';
export default async (req, res) => {
	const logger = new Logger();
	try {
		const {
			text: CONTACT_TEXT,
			email: CONTACT_EMAIL,
			phone: CONTACT_PHONE,
		} = req.body;
		if (!CONTACT_TEXT || CONTACT_TEXT === '') {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, text is missimg ',
				requestTime: new Date().toISOString(),
			});
		}
		if (!CONTACT_EMAIL || CONTACT_EMAIL === '') {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, email is missimg ',
				requestTime: new Date().toISOString(),
			});
		}
		if (!CONTACT_PHONE || CONTACT_PHONE === '') {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, phone is missimg ',
				requestTime: new Date().toISOString(),
			});
		}
		const NEW_CONTACT = await Contact.create({
			text: CONTACT_TEXT,
			email: CONTACT_EMAIL,
			phone: CONTACT_PHONE,
		});
		if (NEW_CONTACT) {
			return res.status(200).json({
				status: 'Success',
				message: 'Contact was added successfully',
				contact: {
					text: CONTACT_TEXT,
					email: CONTACT_EMAIL,
					phone: CONTACT_PHONE,
				},
				requestTime: new Date().toISOString(),
			});
		} else {
			throw new Error('Internal Server error');
		}
	} catch (error) {
		logger.errorLog(req.originalUrl, error.message);
		return res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
			requestTime: new Date().toISOString(),
		});
	}
};
