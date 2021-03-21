process.env.NODE_ENV = 'test';
import {expect} from 'chai';
import request from 'supertest';
import app from '../../Server.js';
import connectDB from '../../config/db.js';
describe('Registering Employee ', () => {
	before((done) => {
		connectDB()
			.then(() => done())
			.catch((err) => done(err));
	});
	it('PASS, Registering Employee correctly', (done) => {
		request(app)
			.post('/api/v1/employee/register')
			.send({
				email: 'testing@employee.com',
				password: '123',
				fullName: 'Testing employee',
				phone: 12345678453,
			})
			.then(({body}) => {
				expect(body).to.contain.property('message');
				expect(body).to.contain.property('fullName');
				expect(body.message).to.equal('User Created Successfully');
				done();
			})
			.catch((err) => done(err));
	});
});
