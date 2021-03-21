process.env.NODE_ENV = 'test';
import {expect} from 'chai';
import request from 'supertest';
import app from '../../Server.js';
import connectDB from '../../config/db.js';
describe('Uploading a manager profile image ', () => {
	before((done) => {
		connectDB()
			.then(() => done())
			.catch((err) => done(err));
	});
	it('FAIL, Upload manager profile image without Manager Login', (done) => {
		request(app)
			.put('/api/v1/manager/profile/image')
			.attach('profileImage', '../storm.jpg')
			.then(({body}) => {
				expect(body).to.contain.property('message');
				expect(body).to.contain.property('error');
				expect(body.message).to.equal('Not Authorized');
				expect(body.error).to.equal(
					'This route needs a higher clearance level'
				);
				done();
			})
			.catch((err) => done(err));
	});
	it('FAIL, Upload manager profile image with Employee Login', (done) => {
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
					.attach('profileImage', '../storm.jpg')
					.set({Authorization: `Bearer ${body.token}`})
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
					.attach('profileImage', '../storm.jpg')
					.set({Authorization: `Bearer ${body.token}`})
					.then(({body}) => {
						expect(body).to.contain.property('imageSrc');
						expect(body).to.contain.property('status');
						expect(body.status).to.equal('Success');
						done();
					})
					.catch((err) => done(err));
			})
			.catch((err) => done(err));
	});
});
