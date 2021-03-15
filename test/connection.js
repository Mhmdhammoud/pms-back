import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
//ES6 promisses
mongoose.Promise = global.Promise;
before((done) => {
	process.on('unhandledRejection', (err) => {
		console.log('Handled rejection:', err.message);
	});

	Promise.reject(new Error('rejection error'));
	//connection
	mongoose.connect(
		'mongodb+srv://hadyachkar:xFYYTQ2ehV9WeA8f@cluster0.dego8.mongodb.net/pms?retryWrites=true&w=majority',
		{
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
		}
	);
	mongoose.connection
		.once('open', () => {
			console.log('Connected to db successfully');
			done();
		})
		.on('error', (err) => {
			console.log('Connection error:'.err);
		});
});
