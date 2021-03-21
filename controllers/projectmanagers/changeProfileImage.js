import {Manager} from '../../models/index.js';
import multer from 'multer';
import AWS from 'aws-sdk';
export default async (req, res) => {
	try {
		const {id: MANAGER_ID} = req.user;
		if (!MANAGER_ID) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, Manager id expected.',
				requestTime: new Date().toISOString(),
			});
		}
		const MANAGER = await Manager.findById(MANAGER_ID);
		if (!MANAGER) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Manager was not found',
				requestTime: new Date().toISOString(),
			});
		}
		// AWS Upload starts here

		let dir = `PMS/manager/${MANAGER_ID}`;

		let upload = multer().single('profileImage');
		upload(req, res, function (err) {
			if (err instanceof multer.MulterError) {
				console.log('Multer Error Occured when uploading : ' + err);
				return err;
			} else if (err) {
				// An unknown error occurred when uploading.
				console.log('error while uploading profile Image : ' + err);
				return err;
			}
			const s3 = new AWS.S3({
				accessKeyId: process.env.AWS_ACESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			});

			const params = {
				Bucket: process.env.BUCKET_NAME,
				Key: `${dir}/${req.files.profileImage.name}`,
				Body: req.files.profileImage.data,
				ContentType: req.files.profileImage.mimetype,
				ContentEncoding: req.files.profileImage.encoding,
			};
			console.log(params);
			s3.upload(params, (err, data) => {
				if (err) {
					console.log('error in upload Task file' + err);
				}
			});
			Manager.findByIdAndUpdate(MANAGER_ID, {
				$set: {
					image: `https://muallemy-storage.s3.eu-central-1.amazonaws.com/${dir}/${req.files.profileImage.name}`,
				},
			}).then((UPDATED_MANAGER) => {
				if (UPDATED_MANAGER) {
					return res.status(200).json({
						status: 'Success',
						message: 'Profile Image was uploaded successfully',
						imageSrc: `https://muallemy-storage.s3.eu-central-1.amazonaws.com/${dir}/${req.files.profileImage.name}`,
						requestTime: new Date().toISOString(),
					});
				}
			});
		});

		// AWS Upload ends here
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
			requestTime: new Date().toISOString(),
		});
	}
};
