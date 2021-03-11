import {Manager} from '../../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
export default async (req, res) => {
	try {
		const USER_ID = req.user.id;
		const MANAGER = await Manager.findById(USER_ID);
		if (!MANAGER) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Manager was not found',
				manager: null,
				requestTime: new Date().toISOString(),
			});
		}
		const {
			fullName: USER_NAME,
			password: USER_PASSWORD,
			phone: USER_PHONE,
			email: USER_EMAIL,
		} = req.body;
		if (!USER_NAME || !USER_EMAIL || !USER_PHONE) {
			return res.status(400).json({
				status: 'Failure',
				message:
					'Bad request, fullName  email ,and phone  are required',
				requestTime: new Date().toISOString(),
			});
		}
		if (!USER_PASSWORD) {
			const UPDATED_MANAGER = await Manager.findByIdAndUpdate(USER_ID, {
				$set: {
					fullName: USER_NAME,
					phone: USER_PHONE,
					email: USER_EMAIL,
				},
			}).select('-__v');
			if (
				UPDATED_MANAGER.fullName == USER_NAME &&
				UPDATED_MANAGER.phone == USER_PHONE &&
				UPDATED_MANAGER.email == USER_EMAIL
			) {
				const payload = {
					email: USER_EMAIL,
					id: UPDATED_MANAGER._id,
					fullName: USER_NAME,
					image: UPDATED_MANAGER.image,
					type: 'Manager',
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
							throw new Error('Internal Server Error');
						}
						console.log(
							`[i] Access Token generated for Manager : ${USER_EMAIL}`
						);
						return res.status(200).json({
							status: 'success',
							message: 'Manager was updated successfully',
							id: UPDATED_MANAGER._id,
							token: encoded,
							image: UPDATED_MANAGER.image,
							fullName: USER_NAME,
							email: USER_EMAIL,
							type: 'Manager',
							requestTime: new Date().toISOString(),
						});
					}
				);
			}
		} else {
			const HASHED_UPDATED_PASSWORD = await bcrypt.hash(
				USER_PASSWORD,
				12
			);
			const UPDATED_MANAGER = await Manager.findByIdAndUpdate(USER_ID, {
				$set: {
					fullName: USER_NAME,
					phone: USER_PHONE,
					email: USER_EMAIL,
					password: HASHED_UPDATED_PASSWORD,
				},
			}).select('-__v');
			if (
				UPDATED_MANAGER.fullName === USER_NAME &&
				UPDATED_MANAGER.phone === USER_PHONE &&
				UPDATED_MANAGER.email === USER_EMAIL
			) {
				const payload = {
					email: USER_EMAIL,
					id: UPDATED_MANAGER._id,
					fullName: USER_NAME,
					image: UPDATED_MANAGER.image,
					type: 'Manager',
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
							throw new Error('Internal Server Error');
						}
						console.log(
							`[i] Access Token generated for Manager : ${USER_EMAIL}`
						);
						return res.status(200).json({
							status: 'success',
							message: 'Manager was updated successfully',
							id: UPDATED_MANAGER._id,
							token: encoded,
							image: UPDATED_MANAGER.image,
							fullName: USER_NAME,
							email: USER_EMAIL,
							type: 'Manager',
							requestTime: new Date().toISOString(),
						});
					}
				);
			}
		}
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
			requestTime: new Date().toISOString(),
		});
	}
};
