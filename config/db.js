import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {Mockgoose} from 'mockgoose';
const connectDB = async () => {
	try {
		if (process.env.NODE_ENV == 'test') {
			dotenv.config();
			const mockgoose = new Mockgoose(mongoose);

			mockgoose.prepareStorage().then(() => {
				mongoose.connect(process.env.MONGO_URI, {
					useUnifiedTopology: true,
					useNewUrlParser: true,
					useCreateIndex: true,
					useFindAndModify: false,
				});
			});
		} else {
			dotenv.config();
			const conn = await mongoose.connect(process.env.MONGO_URI, {
				useUnifiedTopology: true,
				useNewUrlParser: true,
				useCreateIndex: true,
				useFindAndModify: false,
			});
			console.log(
				`MongoDB Connected: ${conn.connection.host}`.cyan.underline
			);
		}
	} catch (error) {
		console.error(`Error: ${error.message}`.red.underline.bold);
		process.exit(1);
	}
};

export default connectDB;
