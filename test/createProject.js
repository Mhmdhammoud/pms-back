import assert from 'assert';
import {Project} from '../models/index.js';

describe('Creating a project to collection project', () => {
	let project;
	beforeEach((done) => {
		project = new Project({
			title: 'Fifth Project',
			duration: 26,
			startingDate: '2021-02-29:00:00:00',
			projectEmployees: [
				{
					employeeID: '602f89ad682f2225f4429494',
				},
			],
		});
		project.save().then(() => {
			done();
		});
	});
	it('Delete the pre saved record', (done) => {
		Project.findByIdAndDelete(project._id).then(() => {
			Project.findById(project._id).then((res) => {
				assert(res === null);
				done();
			});
		});
	});
});
