import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import userRoutes from './routes/employeeRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import managersRouter from './routes/managerRoutes.js';
import generalRouter from './routes/generalRoutes.js';
import generalRoutes from './routes/generealRoutess.js';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import multer from 'multer';
import cors from 'cors';
import bodyParser from 'body-parser';
import Logger from './utils/logger.js';
import HTTP from 'http';
const app = express();
const http = HTTP.createServer(app);
connectDB();
const logger = new Logger();

app.use(express.json());
app.use(
	express.urlencoded({
		extended: false,
	})
);
app.use(
	fileUpload({
		limits: {},
	})
);
app.use(cors());
app.use(bodyParser.json());
app.use(multer().single(''));
app.get('/', (req, res) => {
	res.redirect('https://www.google.com');
});
if (process.env.NODE_ENV == 'development') {
	app.use(morgan('dev'));
}
dotenv.config();

app.use((req, res, next) => {
	req.requestedAt = new Date().toISOString();
	next();
});
app.use('/', (req, res, next) => {
	logger.accessLog(req.ip);
	next();
});
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/manager', managersRouter);
app.use('/api/v1/employee', userRoutes);
app.use('/api/v1/projects', generalRouter);
app.use('/api/v1/general', generalRoutes);
const PORT = process.env.PORT || 5000;

http.listen(PORT, () => {
	console.log(
		`Server is running in ${process.env.NODE_ENV} port ${PORT}`.yellow.bold
	);
	http.on('error', (data) => {
		logger.errorLog(data.originalUrl, data.message);
	});
});
export default app;
