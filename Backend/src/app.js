import express from 'express';
import register from './routes/createuser.route.js';
import userdata from './routes/getuser.route.js';
import cookieParser from 'cookie-parser';
import login from './routes/login.route.js';
import usernameauth from './routes/usernameauth.route.js';
import createTaskRoute from './routes/Create/createTask.route.js';
import readTaskRoute from './routes/Read/Taskread.route.js';

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
app.use('/api/usernameauth', usernameauth);
app.use('/api/createtask', createTaskRoute)
app.use('/api/readtask', readTaskRoute);


export default app;
