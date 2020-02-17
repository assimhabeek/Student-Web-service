import express from 'express';
import UsersController from '../controllers/admin/user';
import CourseController from '../controllers/admin/course';
import MarkController from '../controllers/admin/mark';
import DeliberationController from '../controllers/admin/deliberation';

const router = express.Router();
const studentController = new UsersController('student');
const teacherController = new UsersController('teacher');
const adminController = new UsersController('admin');
const courseController = new CourseController();
const markController = new MarkController();
const deliberationController = new DeliberationController();



// requesting students
router.get('/students', studentController.findAll);

// requesting student with id : ${req.params.id}
router.get('/students/:id', studentController.find);

// creating student : ${req.body}
router.post('/students', studentController.create);

// editing student with id : ${req.body.id}
router.put('/students', studentController.update);

// deleting student with id : ${req.params.id}
router.delete('/students/:id', studentController.remove);



// requesting teachers
router.get('/teachers', teacherController.findAll);

// requesting teacher with id : ${req.params.id}
router.get('/teachers/:id', teacherController.find);

// creating teacher : ${req.body}
router.post('/teachers', teacherController.create);

// editing teacher with id : ${req.body.id}
router.put('/teachers', teacherController.update);

// deleting teacher with id : ${req.params.id}
router.delete('/teachers/:id', teacherController.remove);

// requesting admins
router.get('/admins', adminController.findAll);

// requesting admin with id : ${req.params.id}
router.get('/admins/:id', adminController.find);

// creating admin : ${req.body}
router.post('/admins', adminController.create);

// editing admin with id : ${req.body.id}
router.put('/admins', adminController.update);

// deleting admin with id : ${req.params.id}
router.delete('/admins/:id', adminController.remove);



// requesting courses
router.get('/courses', courseController.findAll);

// requesting course with id : ${req.params.id}
router.get('/courses/:id', courseController.find);

// creating course : ${req.body}
router.post('/courses', courseController.create);

// editing course with id : ${req.body.id}
router.put('/courses', courseController.update);

// deleting course with id : ${req.params.id}
router.delete('/courses/:id', courseController.remove);


// requesting marks
router.get('/marks', markController.findAll);

// requesting mark with id : ${req.params.id}
router.get('/marks/:id', markController.find);

// creating mark : ${req.body}
router.post('/marks', markController.create);

// editing mark with id : ${req.body.id}
router.put('/marks', markController.update);

// deleting mark with id : ${req.params.id}
router.delete('/marks/:id', markController.remove);


// requesting deliberations
router.get('/deliberations', deliberationController.findAll);

// requesting deliberation with id : ${req.params.id}
router.get('/deliberations/:id', deliberationController.find);

// creating deliberation : ${req.body}
router.post('/deliberations', deliberationController.create);

// editing deliberation with id : ${req.body.id}
router.put('/deliberations', deliberationController.update);

// deleting deliberation with id : ${req.params.id}
router.delete('/deliberations/:id', deliberationController.remove);

// auto gen deliberations : empty body
router.post('/deliberations/auto', deliberationController.autoGenerate);


export default router;