import express from 'express';
import MarksController from '../controllers/student/mark';
import DeliberationsController from '../controllers/student/deliberation';

const router = express.Router();
const marksController = new MarksController();
const deliberationsController = new DeliberationsController();

// requesting marks
router.get('/marks', marksController.findAll);

// requesting mark with id : ${req.params.id}
router.get('/marks/:id', marksController.find);

// adding complain for a mark : ${req.body}
// it takes the same object struct of mark
router.put('/marks/complaint', marksController.complain);


// requesting deliberations
router.get('/deliberations', deliberationsController.findAll);

// requesting deliberations with id : ${req.params.id}
router.get('/deliberations/:id', deliberationsController.find);

// adding complain for a deliberations : ${req.body}
// it takes the same object struct of deliberations
router.put('/deliberations/complaint', deliberationsController.complain);


export default router;