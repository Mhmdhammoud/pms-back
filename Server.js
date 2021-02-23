import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import userRoutes from './routes/employeeRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import managersRouter from './routes/managerRoutes.js';
import generalRouter from './routes/generalRoutes.js';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import multer from 'multer';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();

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
app.use(multer().single(''));
app.get('/', (req, res) => {
  res.redirect('https://www.google.com');
});
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/manager', managersRouter);
app.use('/api/v1/employee', userRoutes);
app.use('/api/v1/projects', generalRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} port ${PORT}`.yellow.bold
  );
});
