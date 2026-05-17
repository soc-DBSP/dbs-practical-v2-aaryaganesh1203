const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/studentsController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

// All routes require a valid token and admin role
router.use(jwtMiddleware.verifyToken, jwtMiddleware.verifyIsAdmin);

// GET all students
router.get('/', studentsController.retrieveAll);

// POST enrol new student
router.post('/enrolNewStudent', studentsController.enrolNewStudent);

module.exports = router;