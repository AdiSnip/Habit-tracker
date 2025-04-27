import express from 'express';
import userRoutes from './routes/userauth.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/register', userRoutes);

export default app;