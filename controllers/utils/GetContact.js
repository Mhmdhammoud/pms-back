import {Contact} from '../../models/index.js';
export default async (req, res) => {
	try {
		const ALL_CONTACTS = await Contact.find({});
		if (ALL_CONTACTS.length === 0) {
			return res.status(404).json({
				status: 'Failure',
				contactForms: null,
				message: 'No contacts forms are found at the moment',
				requestTime: new Date().toISOString(),
			});
		} else {
			return res.status(200).json({
				status: 'Success',
				message: 'Contact form were retrieved successfully',
				contactForms: ALL_CONTACTS,
				length: ALL_CONTACTS.length,
				requestTime: new Date().toISOString(),
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
			requestTime: new Date().toISOString(),
		});
	}
};
