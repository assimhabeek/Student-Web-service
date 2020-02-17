import express from 'express';
import bodyParser from 'body-parser';
import url from 'url';
import querystring from 'querystring';
import mongoose from "mongoose";
import config from './config/config.js';
import indexRoutes from './routes/index.js';
import adminRoutes from './routes/admin-routes';
import teacherRoutes from './routes/teacher-routes';
import studentRoutes from './routes/student-routes';
import auth from './controllers/auth.js';

const app = express();
const port = 3000;

mongoose.connect(config.databaseUrl[config.env], { useNewUrlParser: true });

var db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, DELETE, POST, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization');
    next();
});

app.use('/', indexRoutes);
app.use('/admin', auth.isAdmin, adminRoutes);
app.use('/teacher', auth.isTeacher, teacherRoutes);
app.use('/student', auth.isStudent, studentRoutes);


app.listen(port, () => console.log(`server is running on port ${port}!`));


// for unit testing
export default app;