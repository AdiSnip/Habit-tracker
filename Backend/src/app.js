import express from 'express';
import register from './routes/createuser.route.js';
import userdata from './routes/getuser.route.js';
import cookieParser from 'cookie-parser';
import login from './routes/login.route.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Routes
app.use('/api/register', register);
app.use('/api/user', userdata);
app.use('/api/login', login)

export default app;
