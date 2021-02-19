import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import morgan from 'morgan';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}
app.use('/api/v1', userRoutes);
app.use('/api/v1/admin', adminRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} port ${PORT}`.yellow.bold
  );
});
