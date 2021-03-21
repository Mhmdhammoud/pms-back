process.env.NODE_ENV = 'test';
import {expect} from 'chai';
import request from 'supertest';
import app from '../../Server.js';
import connectDB from '../../config/db.js';
describe('Creating a project to collection project ', () => {
	before((done) => {
		connectDB()
			.then(() => done())
			.catch((err) => done(err));
	});
	it('FAIL, Create a new project without Manager Login', (done) => {
		request(app)
			.post('/api/v1/manager/project/create')
			.send({
				title: 'New Test Project',
				duration: 12,
				startingDate: new Date().toISOString(),
				description: 'New create project test description',
			})
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
	it('FAIL, Create a new project with Employee Login', (done) => {
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
					.post('/api/v1/manager/project/create')
					.send({
						title: 'New Test Project',
						duration: 12,
						startingDate: new Date().toISOString(),
						description: 'New create project test description',
					})
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
	it('PASS, Create a new project with Manager Login', (done) => {
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
					.post('/api/v1/manager/project/create')
					.send({
						title: 'New Test Project',
						duration: 12,
						startingDate: new Date().toISOString(),
						description: 'New create project test description',
					})
					.set({Authorization: `Bearer ${body.token}`})
					.then(({body}) => {
						expect(body).to.contain.property('project');
						expect(body).to.contain.property('status');
						expect(body.status).to.equal('Success');
						expect(body.project).to.contain.property('_id');
						done();
					})
					.catch((err) => done(err));
			})
			.catch((err) => done(err));
	});
});
