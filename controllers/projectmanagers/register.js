import {Manager} from '../../models/index.js';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
	try {
		const {email, password, fullName, phone, image} = req.body;
		if (isNaN(phone)) {
			return res.status(400).json({
				message: 'Phone Number should be a number',
				phone: phone,
				'expected format': 12345678,
			});
		}
		const checked = await Manager.findOne({
			$or: [
				{
					email: `${email}`,
				},
				{
					phone: `${phone}`,
				},
			],
		});
		if (checked) {
			return res.status(400).json({
				message:
					'User is already found in the DB, please choose a different email or phone number',
				email,
				phone,
			});
		} else {
			const NewManager = await Manager.create({
				fullName,
				password,
				phone,
				email,
			});
			if (NewManager) {
				const payload = {
					email: email,
					id: NewManager._id,
					fullName: NewManager.fullName,
					image: NewManager.image,
				};

				jwt.sign(
					payload,
					process.env.MANAGER_SECRET,
					{
						expiresIn: '1460h',
					},
					(error, encoded) => {
						if (error) {
							console.log(error);
							return res.status(500).json({
								message: 'Internal Server Error',
							});
						}
						return res.status(200).json({
							message: 'User Created Successfully',
							email,
							fullName,
							phone,
							image: NewManager.image,
							id: NewManager._id,
							token: encoded,
						});
					}
				);
			}
		}
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
		});
	}
};
