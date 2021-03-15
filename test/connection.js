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
	mongoose.connect(process.env.MONGO_URI, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
	});
	mongoose.connection
		.once('open', () => {
			console.log('Connected to db successfully');
			done();
		})
		.on('error', (err) => {
			console.log('Connection error:'.err);
		});
});
