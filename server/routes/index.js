import express from 'express';
import authController from '../controllers/auth';

const router = express.Router();



import User from '../models/users-model';
import Course from '../models/courses-model';
import Mark from '../models/marks-model';
import Deliberation from '../models/deliberations-model';
import users from '../test/mock-data/user-mock-data';
import courses from '../test/mock-data/course-mock-data';
import marks from '../test/mock-data/mark-mock-data';
import dlrs from '../test/mock-data/deliberation-mock-data';
import config from '../config/config';
import answer from '../utils/answer';

if(config.env=='test-e2e')
// createTestDatabase for e2e testing
router.get('/init', function (req, res) {
    User.insertMany(users, function (e, usr) {
        Course.insertMany(courses, function (er, crs) {
            Mark.insertMany(marks, function (err, mrk) {
                Deliberation.insertMany(dlrs, function (erro, delbr) {
                    answer(res, 200, true, "Database created !", {});
                })
            })
        })
    })
})


// login ${req.body}
router.post('/login', authController.login);

// isloggedIn ${req.body}
router.get('/isLoggedIn', authController.isLoggedIn);


export default router;