import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import userRoutes from './routes/employeeRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import managersRouter from './routes/managerRoutes.js';
import morgan from 'morgan';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/manager', managersRouter);
app.use('/api/v1/employee', userRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} port ${PORT}`.yellow.bold
  );
});
