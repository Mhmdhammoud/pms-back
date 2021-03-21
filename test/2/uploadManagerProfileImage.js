process.env.NODE_ENV = 'test';
import {expect} from 'chai';
import request from 'supertest';
import app from '../../Server.js';
import connectDB from '../../config/db.js';
import AWS from 'aws-sdk';
async function emptyS3Directory(dir) {
	const s3 = new AWS.S3({
		accessKeyId: process.env.AWS_ACESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	});

	const listParams = {
		Bucket: process.env.BUCKET_NAME,
		Prefix: dir,
	};

	const listedObjects = await s3.listObjectsV2(listParams).promise();

	if (listedObjects.Contents.length === 0) return;

	const deleteParams = {
		Bucket: process.env.BUCKET_NAME,
		Delete: {Objects: []},
	};

	listedObjects.Contents.forEach(({Key}) => {
		deleteParams.Delete.Objects.push({Key});
	});

	await s3.deleteObjects(deleteParams).promise();

	if (listedObjects.IsTruncated) await emptyS3Directory(dir);
}
describe('Uploading a manager profile image ', () => {
	before((done) => {
		connectDB()
			.then(() => done())
			.catch((err) => done(err));
	});
	it('FAIL, Upload manager profile image without Manager Login', (done) => {
		const buffer = Buffer.from('../storm.jpg');
		request(app)
			.put('/api/v1/manager/profile/image')
			.attach('profileImage', buffer, 'storm.jpg')
			.set({'Content-Type': 'multipart'})
			.then(({body}) => {
				expect(body).to.contain.property('message');
				expect(body).to.contain.property('error');
				expect(body.message).to.equal('Not Authorized');
				expect(body.error).to.equal(
					'This route needs a higher clearance level'
				);
				expect(403);
				done();
			})
			.catch((err) => done(err));
	});
	it('FAIL, Upload manager profile image with Employee Login', (done) => {
		const buffer = Buffer.from('../storm.jpg');
		request(app)
			.post('/api/v1/employee/login')
			.send({
				email: 'testing@employee.com',
				password: '123',
			})
			.then(({body}) => {
				expect(body).to.contain.property('token');
				expect(body).to.contain.property('status');
				expect(body.status).to.equal('success');
				request(app)
					.put('/api/v1/manager/profile/image')
					.attach('profileImage', buffer, 'storm.jpg')
					.set({Authorization: `Bearer ${body.token}`})
					.set({'Content-Type': 'multipart'})
					.then(({body}) => {
						expect(body).to.contain.property('message');
						expect(body).to.contain.property('error');
						expect(body.message).to.equal('Internal Server Error');
						expect(body.error).to.equal('invalid signature');
						done();
					})
					.catch((err) => done(err));
			})
			.catch((err) => done(err));
	});
	it('PASS,  Upload manager profile image with Manager Login', (done) => {
		const buffer = Buffer.from('../storm.jpg');
		request(app)
			.post('/api/v1/manager/login')
			.send({
				email: 'testing@manager.com',
				password: '123',
			})
			.then(({body}) => {
				expect(body).to.contain.property('token');
				expect(body).to.contain.property('status');
				expect(body.status).to.equal('success');
				request(app)
					.put('/api/v1/manager/profile/image')
					.attach('profileImage', buffer, 'test-image.jpg')
					.set({Authorization: `Bearer ${body.token}`})
					.set({'Content-Type': 'multipart'})
					.then(({body: uploadBody}) => {
						expect(uploadBody).to.contain.property('imageSrc');
						expect(uploadBody).to.contain.property('status');
						expect(uploadBody.status).to.equal('Success');
						emptyS3Directory(`PMS/manager/${body.id}`).then(() => {
							done();
						});
					})
					.catch((err) => done(err));
			})
			.catch((err) => done(err));
	});
});
