import express from 'express';
import CourseController from '../controllers/teacher/course';
import MarksController from '../controllers/teacher/mark';
import StudentsController from '../controllers/teacher/student';

const router = express.Router();
const courseController = new CourseController();
const markController = new MarksController();
const studentController = new StudentsController();

// requesting courses
router.get('/courses', courseController.findAll);

// requesting course with id : ${req.params.id}
router.get('/courses/:id', courseController.find);

// requesting students
router.get('/students', studentController.findAll);

// requesting student with id : ${req.params.id}
router.get('/students/:id', studentController.find);


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

// auto gen marks : ${req.body}
router.post('/marks/auto', markController.autoGen);

export default router;