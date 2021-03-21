process.env.NODE_ENV = 'test';
import {expect} from 'chai';
import request from 'supertest';
import app from '../../Server.js';
import connectDB from '../../config/db.js';
describe('Registering Manager ', () => {
	before((done) => {
		connectDB()
			.then(() => done())
			.catch((err) => done(err));
	});
	it('PASS, Registering Manager correctly', (done) => {
		request(app)
			.post('/api/v1/manager/register')
			.send({
				email: 'testing@manager.com',
				password: '123',
				fullName: 'Testing Manager',
				phone: 1234567845,
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
