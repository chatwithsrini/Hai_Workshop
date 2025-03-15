import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { connectDB } from './config/db';
import userRoutes from './routes/userRoutes';
import bookRoutes from './routes/bookRoutes';
import cartRoutes from './routes/cartRoutes';
import cors from 'cors';
import path from 'path';

const app: Application = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', userRoutes);
app.use('/api', bookRoutes);
app.use('/api', cartRoutes);

// Connect to MongoDB Atlas
connectDB().then(() => {
  console.log('Connected to MongoDB Atlas successfully');
}).catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
});

export default app;
