import {Employee} from '../../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export default async (req, res) => {
	try {
		const USER_ID = req.user.id;
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
			const UPDATED_EMPLOYEE = await Employee.findByIdAndUpdate(USER_ID, {
				$set: {
					fullName: USER_NAME,
					phone: USER_PHONE,
					email: USER_EMAIL,
				},
			});
			console.log(UPDATED_EMPLOYEE);
			if (
				UPDATED_EMPLOYEE.fullName == USER_NAME &&
				UPDATED_EMPLOYEE.phone == USER_PHONE &&
				UPDATED_EMPLOYEE.email == USER_EMAIL
			) {
				const payload = {
					email: USER_EMAIL,
					id: UPDATED_EMPLOYEE._id,
					fullName: USER_NAME,
					image: UPDATED_EMPLOYEE.image,
					type: 'Employee',
				};

				jwt.sign(
					payload,
					process.env.EMPLOYEE_SECRET,
					{
						expiresIn: '1460h',
					},
					(error, encoded) => {
						if (error) {
							console.log(error);
							throw new Error('Internal Server Error');
						}
						console.log(
							`[i] Access Token generated for Employee : ${USER_EMAIL}`
						);
						return res.status(200).json({
							status: 'success',
							message: 'Employee was updated successfully',
							id: UPDATED_EMPLOYEE._id,
							token: encoded,
							image: UPDATED_EMPLOYEE.image,
							fullName: USER_NAME,
							email: USER_EMAIL,
							type: 'Employee',
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
			const UPDATED_EMPLOYEE = await Employee.findByIdAndUpdate(USER_ID, {
				$set: {
					fullName: USER_NAME,
					phone: USER_PHONE,
					email: USER_EMAIL,
					password: HASHED_UPDATED_PASSWORD,
				},
			});
			if (
				UPDATED_EMPLOYEE.fullName === USER_NAME &&
				UPDATED_EMPLOYEE.phone === USER_PHONE &&
				UPDATED_EMPLOYEE.email === USER_EMAIL
			) {
				const payload = {
					email: USER_EMAIL,
					id: UPDATED_EMPLOYEE._id,
					fullName: USER_NAME,
					image: UPDATED_EMPLOYEE.image,
					type: 'Employee',
				};

				jwt.sign(
					payload,
					process.env.EMPLOYEE_SECRET,
					{
						expiresIn: '1460h',
					},
					(error, encoded) => {
						if (error) {
							console.log(error);
							throw new Error('Internal Server Error');
						}
						console.log(
							`[i] Access Token generated for Employee : ${USER_EMAIL}`
						);
						return res.status(200).json({
							status: 'success',
							message: 'Employee was updated successfully',
							id: UPDATED_EMPLOYEE._id,
							token: encoded,
							image: UPDATED_EMPLOYEE.image,
							fullName: USER_NAME,
							email: USER_EMAIL,
							type: 'Employee',
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
		});
	}
};
